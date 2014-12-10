**Magento Frontend mit Bootstrap SCSS**
======================
In diesem Artikel schauen wir gemeinsam, wie ein **Magento Theme** auf **Bootstrap** aufgebaut werden kann und warum es gar nicht so kompliziert ist wie vermutet. Ziel ist es herauszufinden, wie **Bootstrap** mit möglich wenig Klassen-Überschreibungen, einfach und effektiv eingesetzt werden kann.

#### Warum?

**Weil** mit jedem **Boilerplate Theme**, welches auf einem Framework basiert auch eine große Anzahl an Überschreibungen auf uns zu kommen, erst recht wenn es um so komplexe Systeme wie [Magento](http://magento.com/) und um ein Framework wie [Bootstrap](http://getbootstrap.com/) geht.  
Ein wenig besser wird es, wenn wir statt dem normalen **Bootstrap CSS** zu [**less**](http://lesscss.org/) oder [**SASS**](http://sass-lang.com/) greifen aber um eine wirklich saubere Basis zu bekommen empfiehlt es sich im ersten Schritt auf weitestgehend alles Vorhandene zu verzichten und **nur das Magento HTML als Basis** zu sehen.

Ja es ist viel Arbeit doch es zahlt sich aus, zumindest Gedanklich, dieses Experiment zu machen. Durch einige wirklich hilfreiche Funktionen von Bootstrap ist es nämlich einfacher als man denkt.

Da ich keineswegs von Boilerplates abraten will, möchte ich an dieser Stelle die Webcomm [HTML5 Magento Bootstrap Boilerplate](https://github.com/webcomm/magento-boilerplate) hervorheben, mit der ich gute Erfahrung sammeln konnte. Neben einer gelungenen Integration finden wir hier sehr gute CSS Klassen-Mappings zwischen Magento und Bootstrap.

**Und los geht's**
----------------------
Wir könnten natürlich nun, wie es so manch erster Gedanke ist, die ganzen `.phtml` Template-Dateien von Magento ändern und **Bootstrap CSS-Klassen** einfügen aber wir wollen möglichst wenig an diesen Dateien verändern. Für einige wenige Templates könnte man dies natürlich machen aber wann hört es auf? 
Bei dem Einsatz eines Frameworks wie **Bootstrap** ist wichtig, dass man möglichst viel davon benutzt, damit man das ohnehin schon große Stylesheet nicht noch zusätzlich aufbläht. 

Die Lösung der benannte Probleme ist wie angedeutet der Einsatz einer Präprozessor Sprache wie **SASS/SCSS** oder **less**. Da Bootstrap mittlerweile **SASS/SCSS** auch offiziell unterstützt, kann man sich hier sein Mittel der Wahl aussuchen, ich persönlich tendiere aber zu **SASS/SCSS**, da mir die Syntax angenehmer ist, ich bisher alles in SCSS mache und die Community aktiver zu sein scheint.

Nun gibt es hier erstmal ein wenig mehr Vorarbeit zu leisten als einfach eine CSS-Datei an Ort und Stelle zu kopieren.

### 1. Bootstrap aufsetzen
Der einfache Weg ist, die gewünschten Bootstrap Version als gepackte Datei herunter zu laden und in ein Magento Theme Package einzufügen. Dazu wählt man auf der [**Bootstrap Download-Page**](http://getbootstrap.com/getting-started/#download) zwischen den Optionen "Source Code" (Less) oder der SASS/SCSS Variante. 

Bootstrap liefert hier ein komplettes Paket, inklusive einem **Bower-file** welches das updaten der Bootstrap Dateien vereinfacht, insofern man [**Bower**](http://bower.io/) nutzen will. Bower ist ein Package-Manager der es uns Entwicklern einfacher machen soll z.B. Frameworks wie Bootstrap aktuell zu halten. Ich kann es an dieser Stelle nur empfehlen, da es den Update-Prozess enorm vereinfacht. Für unser Beispiel in diesem Artikel reicht uns aber der Ordner "assets", aus dem heruntergeladenen Paket, vollkommen aus. 

Eure Dateistruktur könnten nun wie folgt aussehen:
```
skin/frontend/bootstrap/default
    |- bootstrap
        |- assets
    |- scss
    |- css
    |- js
    |- fonts
	    |- bootstrap
```
Die Ordner `css`, `js` und `fonts/bootstrap` sind dynamisch befüllte Ordner. Im Ordner `scss` werden im späteren Verlauf die Style Änderungen gemacht.

### 2. Magento Dateien entfernen und Bootstrap laden
Als nächstes müssen wir in der `local.xml` des neuen Magento Themes die Meta-Tags für `viewport` und `http-equiv X-UA-Compatible` einfügen. Weiterhin entfernen wir das bisherige Magento CSS und weitere störende Dateien wie z.B. JavaScript Bibliotheken, mit Funktionen welche in Bootstrap ebenfalls verfügbar sind. Die Einbindung der Datei `styles.css` kann bestehen bleiben, da wir später genau diese Datei dynamisch ausliefern werden um den Theme-Fallback nicht zu brechen.
```
app/design/frontend/bootstrap/default
    |- layout
        |- local.xml
```
```xml
<?xml version="1.0"?>
<layout version="0.1.0">
    <default>
        <reference name="head">
            <!-- Entfernen von Magento Default Dateien -->
            <action method="removeItem">
                <type>skin_css</type>
                <name>css/print.css</name>
            </action>
            <action method="removeItem">
                <type>skin_css</type>
                <name>css/styles-ie.css</name>
            </action>
            <action method="removeItem">
                <type>skin_css</type>
                <name>css/widgets.css</name>
            </action>
            <action method="removeItem">
                <type>skin_js</type>
                <name>js/ie6.js</name>
            </action>
            <action method="removeItem">
                <type>js</type>
                <name>lib/ds-sleight.js</name>
            </action>
            <action method="removeItem">
                <type>js</type>
                <name>varien/menu.js</name>
            </action>

            <!-- Laden der Bootstrap JS Datei -->
            <action method="addItem">
                <type>skin_js</type>
                <name>js/bootstrap.min.js</name>
            </action>

            <!-- Setzen der neuen Meta Tags -->
            <block type="core/text" name="head.bs.ux">
                <action method="setText"><text><![CDATA[<meta http-equiv="X-UA-Compatible" content="IE=edge">]]>&#10;</text></action>
            </block>
            <block type="core/text" name="head.bs.viewport">
                <action method="setText"><text><![CDATA[<meta name="viewport" content="width=device-width, initial-scale=1">]]>&#10;</text></action>
            </block>
        </reference>
    </default>
</layout>
```
Weiterhin haben wir mit Hilfe der neuen Fallback-Konfiguration, mit der Datei `app/design/frontend/bootstrap/default/etc/theme.xml`, das Theme auf `default/default` aufgebaut. Der Grund dafür ist nur, damit wir im Frontend keine Broken-Images sehen und das RWD-Theme leider noch nicht ausgereift ist. Generell ist es natürlich möglich, das neue Theme auch auf dem RWD-Theme aufzusetzen. In diesem Fall sollte man nur beachten, dass wir schon den `HTML5` Doctype und das Meta-Tag für `viewport` im `head` haben aber dafür noch weitere CSS-Dateien entfernt werden müssen. Weiterhin fehlt beim RWD-Theme noch der Meta-Tag `<meta http-equiv="X-UA-Compatible" content="IE=edge">` um dem IE beizubringen was Sache ist.

### 3. Kompilierung der Bootstrap SCSS- und JS-Dateien
Um die Bootstrap Komponenten nun vom Assets-Ordner zu JS und CSS Dateien zu Kompilieren nutzen wir [Gulp](http://gulpjs.com/) und einfache Gulp-Tasks. Das **Gulp-File**, die Konfigurations-Datei für Tasks, legen wir für unser Beispiel ebenfalls im Theme-Ordner ab, genauso wie die [NPM](https://www.npmjs.org/) **Package-Datei** zum Installieren der Gulp-Module.
```
skin/frontend/bootstrap/default
    |- gulpfile.js
    |- package.json
```
Wer sich bisher nicht mit diesem **Workflow** vertraut gemacht sollte ich einen der vielen guten Artikel dazu ansehen wie zum Beispiel ["Building With Gulp"](http://www.smashingmagazine.com/2014/06/11/building-with-gulp/) auf [smashingmagazine.com](http://www.smashingmagazine.com/). Im groben ist die Installation, zumindest unter Windows, sehr einfach:

1. [Node](http://nodejs.org/) installieren
2. Da NPM zusammen mit Node installiert wurde nun einfach die Konsole öffnen und mit der Eingabe von `npm --version` schauen ob es korrekt installiert wurde.
3. Gulp global installieren `npm install -g gulp`.
4. Testen ob Gulp korrekt installiert wurde `gulp --version`
5. Party on.
 
#### Das Gulp-File:
```js
var gulp   = require('gulp'),
    sass   = require('gulp-sass'),
    rimraf = require('gulp-rimraf')
    concat = require('gulp-concat');

// SCSS
gulp.task('scss', ['clean'], function() {
    return  gulp.src('scss/styles.scss')
            .pipe(sass())
            .pipe(gulp.dest('./css'));
});

// Bootstrap JavaScript
gulp.task('js', ['clean'], function() {
    return  gulp.src([
                "bootstrap/assets/javascripts/bootstrap/modal.js"
            ])
            .pipe(concat('bootstrap.min.js'))
            .pipe(gulp.dest('./js'));
});

// Moving Bootstrap Fonts
gulp.task('fonts', ['clean'], function () {
    return  gulp.src(
                'bootstrap/assets/fonts/bootstrap/*'
            )
            .pipe(gulp.dest('fonts/bootstrap'));
});

// Clean
gulp.task('clean', function() {
    return  gulp.src([
                './css',
                './js',
                './fonts/bootstrap'
            ],{read: false})
            .pipe(rimraf({
                force: true
            }));
});

gulp.task('default', ['clean', 'scss', 'js', 'fonts']);
```
Um sicher zu gehen das unsere dynamisch erstellten Dateien gelöscht werden bevor wir sie neu erstellen, benötigen wir den `clean` Task welcher als Abhängigkeit in jedem anderen Task gesetzt wird und somit als erstes ausgeführt wird.

Wenn wir mehrere **Bootstrap Javascript Komponenten** nutzen wollen, können wir diese über den `js` Task zusammenschreiben lassen. Welche Module benutzt werden sollen, muss im `src` des Tasks angegeben werden wie im Beispiel, das "Bootstrap-Modal". Schön hieran ist, dass wir kontrollieren können wie groß unsere JavaScript Datei am Ende wird und wir wirklich benötigte Module laden. Über weitere Gulp-Module wie z.B. [gulp-uglify](https://www.npmjs.org/package/gulp-uglify) kann man die JavaScript Module auch komprimieren oder auch über [gulp-jshint](https://www.npmjs.org/package/gulp-jshint) Testen.

Der `scss` Task für das Kompilieren der SCSS-Dateien benötigt nur die Angabe der Datei `styles.scss` denn alle weiteren Dateien werden in der besagten SCSS-Datei verknüpft. Auch hier haben wir mit weiteren Gulp-Modulen die Möglichkeit mehr als nur CSS zu erstellen, hier ein paar Beispiele:

- **Komprimieren** mit [gulp-minify-css](https://www.npmjs.org/package/gulp-minify-css)
- **Aufteilung in mehrere CSS-Dateien** falls das Klassen-Maximum erreicht ist (IE) mit [gulp-bless](https://www.npmjs.org/package/gulp-bless)
- **Above the fold** Optimierung [critical-path-css-demo](https://github.com/addyosmani/critical-path-css-demo)

#### Die Package Datei:
Die Package Datei benötigen wir um alle **Gulp-Module** zu installieren, d.h. egal wo wir mit diesem Code arbeiten, durch das Ausführen von `npm install` werden alle benötigten Module installiert.
```json
{
    "name": "bootstrap_magento_theme",
    "version": "0.0.1",
    "description": "Example of how to handle magento frontend together with bootstrap",
    "author": "Tobias Hartmann",
    "dependencies": {
        "gulp": "^3.8.10",
        "gulp-rimraf": "^0.1.1",
        "gulp-concat": "^2.4.2",
        "gulp-sass": "^1.2.4"
    }
}
```

### 4. Aufsetzen der Style SCSS
Nun kommen wir zur Style-Datei, sozusagen dem **CSS-Herzstück** unseres Themes.

Um herauszufinden welche Bootstrap Standard Dateien wir benötigen, öffnen wir im Ordner `assets` die Datei `_bootstrap.scss`. Wir könnten diese Datei auch direkt in unserer `styles.scss` mit `@import` einbinden, dabei würden wir aber sämtliche Komponenten laden, was in den meisten Fällen unnötig ist. 

In der Bootstrap Datei befinden sich glücklicher Weise Kommentare, welche uns helfen zu identifizieren was wir benötigen und was nicht. Alles was mit **Components** beschrieben ist, ist Optional, alles andere wird dringend benötigt, easy.
```scss
// Core variables and mixins
@import "bootstrap/assets/stylesheets/bootstrap/variables";
@import "bootstrap/assets/stylesheets/bootstrap/mixins";

//-------------------
// User Settings: 
// Deine Bootstrap Einstellungen sollten später hier eingefügt werden:
//-------------------

// Reset and dependencies
@import "bootstrap/assets/stylesheets/bootstrap/normalize";
@import "bootstrap/assets/stylesheets/bootstrap/print";
@import "bootstrap/assets/stylesheets/bootstrap/glyphicons";

// Core CSS
@import "bootstrap/assets/stylesheets/bootstrap/scaffolding";
@import "bootstrap/assets/stylesheets/bootstrap/type";
@import "bootstrap/assets/stylesheets/bootstrap/code";
@import "bootstrap/assets/stylesheets/bootstrap/grid";
@import "bootstrap/assets/stylesheets/bootstrap/tables";
@import "bootstrap/assets/stylesheets/bootstrap/forms";
@import "bootstrap/assets/stylesheets/bootstrap/buttons";

//-------------------
// Bootstrap Modules:
// Hier kannst du weitere Komponenten einfügen je nachdem welche benötig werden.
@import "bootstrap/assets/stylesheets/bootstrap/close";
@import "bootstrap/assets/stylesheets/bootstrap/modals";
//-------------------

// Utility classes
@import "bootstrap/assets/stylesheets/bootstrap/utilities";
@import "bootstrap/assets/stylesheets/bootstrap/responsive-utilities";

//-------------------
// User Modules:
// Deine SCSS Dateien sollten später hier eingefügt werden:
//-------------------
```
Ich habe mir erlaubt schon mal die Stellen mit Kommentaren zu versehen, an denen wir später unsere Styles und Module hinterlegen. 

Die Sektion **User Settings** wird dabei weitestgehend mit Variablen aus der Datei `skin/frontend/bootstrap/default/bootstrap/assets/stylesheets/bootstrap/_variables.scss` befüllt, welche dort auf das eigene Theme angepasst werden. Natürlich ist es auch ein perfekter Platz um eigene Variablen abzulegen, insofern diese Global verfügbar sein sollen. 

In der Sektion **Bootstrap Modules** führen wir alle Module auf welche wir später im Shop benutzen wollen. Eine Liste mit allen verfügbaren Modulen findet ihr in der Datei `skin/frontend/bootstrap/default/bootstrap/assets/stylesheets/_bootstrap.scss` unter dem Kommentar `// Components` und `// Components w/ JavaScript`.

Die Sektion **User Modules** ist den eigenen Modulen vorbehalten, von denen wir ein paar im Folgenden beschreiben werden.

### 5. Das erste Mal Gulp
Super, wir sind soweit, nun können wir unseren Code das erste Mal über Gulp in den CSS-, JS- und Font-Ordner schreiben lassen. Also nur Mut, `gulp` in die Konsole eingeben und Return/Enter drücken. Eure Konsole wird nun die Einzelnen Tasks ausgeben und am Ende sollten wir in den oben genannten Ordnern Dateien vorfinden.  

**SCSS, Mappings, Tipps und Tricks**
----------------------
Da wir in diesem Artikel keine komplette Boilerplate bauen wollen, möchte ich hier nur auf ein paar der wichtigsten und hilfreichsten [**Bootstrap Mixins**](http://getbootstrap.com/css/#less-mixins-vendor) eingehen. Leider zeigt uns die Bootstrap Dokumentation, im oben gesetzten link nur **less Mixins**, schön ist aber dass diese Mixins auch in **SCSS** zur Verfügung stehen, wie ihr später noch sehen werdet. 

Neben [**SCSS-Mixins**](http://sass-lang.com/guide#topic-6), bei denen es sich sozusagen um "Methoden" zum effektiveren erstellen von CSS handelt, benutzen wir auch [**Extends**](http://sass-lang.com/guide#topic-7) um vorhandene CSS-Klassen zu erweitern.

Damit wir ein wenig die **Ordnung** behalten, denn es können wirklich sehr sehr viele Mappings werden, empfiehlt es sich die Mappings nicht nur in eine, sondern in mehrere Dateien, auszulagern. Für mich hat sich dabei die folgende Struktur bewährt:
```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- _Globale-Klassen.scss
        |- Blockname
            |- _Block-Klassen.scss
            |- __Kind-Klassen.scss
            |- Verschachtelter Block
	            |- _Block-Klassen.scss
	            |- __Kind-Klassen.scss
```
Also für jeden Block für den es sich lohnt z.B. "Page", mache ich dabei einen eigenen Ordner auf. Darunter lege ich eine Datei ab, welche die Block-Klassen enthält und mit `__` gekennzeichnet Dateien, welche jeweils einen Kind-Block enthalten. Wenn Blöcke wie "Catalog/Product" verschachtelt sind, können wir diese auch genau so anlegen z.B.:
```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- Catalog
            |- Product
	            |- _product.scss
	            |- __grid.scss
	            |- __list.scss
```

### Bootstrap konfigurieren:
Da Bootstrap von vorn herein ein gewisses Styling mit sich bringt könnte man, falls dieses Styling passend ist, darauf verzichten die Konfiguration zu überschreiben. Wir wollen uns aber trotzdem zumindest anschauen wie es geht. 

Die Konfiguration nehmen wir direkt in der `styles.scss` vor und halten uns dabei an die Bootstrap-Variablen welche unter `bootstrap/assets/stylesheets/bootstrap/_variables.scss` zu finden sind. Ein paar der interessantesten habe ich im Folgenden aufgezeigt.
```scss
// Grid:
$grid-columns:              12;
$grid-gutter-width:         20px;
$grid-float-breakpoint:     $screen-sm-min;
$grid-float-breakpoint-max: ($grid-float-breakpoint - 1);

// Container:
$container-tablet:          (720px + $grid-gutter-width);
$container-sm:              $container-tablet;
$container-desktop:         (940px + $grid-gutter-width);
$container-md:              $container-desktop;
$container-large-desktop:   (1140px + $grid-gutter-width);
$container-lg:              $container-large-desktop;

// Schriften:
$font-family-base:      $font-family-sans-serif !default;
$font-size-base:        14px !default;
$font-size-large:       ceil(($font-size-base * 1.25)) !default; // ~18px
$font-size-small:       ceil(($font-size-base * 0.85)) !default; // ~12px

// Buttons:
$btn-default-color:     #333;
$btn-default-bg:        #fff;
$btn-default-border:    #ccc;

// Farben:
$brand-primary:         darken(#428bca, 6.5%);
$brand-success:         #5cb85c;
$brand-info:            #5bc0de;
$brand-warning:         #f0ad4e;
$brand-danger:          #d9534f;
```
Ihr seht also, wir können anhand von wenigen **Bootstrap Variablen** massiv modifizieren und dies sollten wir auch nutzen. Wenn ihr über die `_variables.scss` geht fällt euch auch bestimmt `!default` ins Auge. Dies hat keineswegs irgendwas mit dem aus CSS bekannten `!important` zu tun, vielmehr bezeichnet es das der aktuelle Wert dieser Variable "Default" ist und überschrieben werden kann. Wenn ein Wert in einer Variable gesetzt wurde, wird er bei der Benutzung von "Default" nicht erneut gesetzt (Überschrieben):
```scss
$content: "First content";
$content: "Second content?" !default;
$new_content: "First time reference" !default;

#main {
  content: $content;
  new-content: $new_content;
}
```
wird Kompiliert zu:
```css
#main {
  content: "First content";
  new-content: "First time reference"; }
```
Wenn wir neue globale Variablen anlegen, sollten diese also immer die Bezeichnung `!default` bekommen, damit wir für diese Variable einen Fallback haben.

### Das Page Grid: 
Es ist einfacher als man denkt auf die bestehenden Magento Klassen das Bootstrap Grid zu mappen. Die Macher von Bootstrap waren nämlich so nett uns auch hierfür einige Mixins zu liefern. Ein super Vorteil davon ist, dass der Shop sogleich einen gewaltigen Schritt in Sachen **Responsive** nach vorn macht. 

Die **Grid-Mixins** könnt ihr in diesem Ordner finden:
`bootstrap\assets\stylesheets\bootstrap\mixins\__grid.scss`

Bringen wir also unser Magento Frontend wieder etwas in Form. Als erstes kümmern wir uns um die **Pages** also die generelle Seitenstruktur. Dazu erweitern wir unser SCSS um folgende Datei:
```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- page
            |- __grid.scss
```
und natürlich referenzieren wir diese auch in der `styles.scss` mit `@import "page/__grid";`.

In unserer **Page-Grid** `page/__grid.scss` sammeln wir nun die wichtigsten gegebenen CSS Struktur-Klassen und erweitern diese mit den zur Verfügung stehenden Mixins. Ich habe mir erlaubt dies im Folgenden schon einmal vorzubereiten:

```scss
.page {
    @extend .container;
}
.main-container {
    @extend .row;

    //==== col 1 layout ====
    &.col1-layout {
        .col-main {
            @include make-md-column(12);
        }
    }

    //==== col 2 layout ====
    &.col2-left-layout,
    &.col2-right-layout {
        .col-main {
            @include make-md-column(8);
        }
    }
    &.col2-left-layout {
        .col-left {
            @include make-md-column(4);
        }
    }
    &.col2-right-layout {
        .col-right {
            @include make-md-column(4);
        }
    }

    //==== col 3 layout ====
    &.col3-layout {
        .col-main {
            @include make-md-column(6);
        }
        .sidebar {
            @include make-md-column(3);
        }
    }
}
```
Zur Erklärung, die **Mixins** die uns hier das Leben erleichtern sind folgende

- `make-row($gutter)` 
- `make-[breakpoint]-column($columns, $gutter)` 

Sicherlich kann man den SCSS-Code auch noch weiter zusammenfassen, ich habe aber wegen der Übersichtlichkeit darauf verzichtet. 

**Warum benutze ich nicht überall **`@extend`**?** 
Gute Frage, ich habe erstens extra hierauf verzichtet damit ich euch zeigen kann wie flexibel Bootstrap ist und zweitens war `@extend`  bis zu der Version 1.2.0 von "gulp-sass" nicht in der Lage z.B. Media-Queries, welche in dem zu Erweiternden Element gesetzt wurden, zu berücksichtigen.

Flexibel wird Bootstrap hier weil man diesen Mixins sowohl die Spaltenanzahl als auch die Gutter-Breite mitgeben kann, wir sind also in der Lage das Grid in Abhängigkeit eines Scopes anzupassen. Wichtig ist zudem zu erwähnen, dass man Bootstrap Grids **verschachteln** kann, dabei müssen diese allerding nochmals von einer `.row` umgeben werden.
 
Leider müssen wir an dieser Stelle auch an die Magento **Page-Templates** ran. Deren HTML Struktur lässt nämlich ob im RWD-Theme oder im Default zu wünschen übrig, also reduzieren wir diese etwas und schieben vor allem die linke Spalte vor die Haupt-Spalte.
```
app/design/frontend/bootstrap/default
    |- layout
    |- templates
        |- themes
            |- 1column.phtml
            |- 2columns-left.phtml
            |- 2columns-right.phtml
            |- 3columns.phtml
```
Hier ein Beispiel anhand der `3columns.phtml`. Nicht zu vergessen, dass wir einen **HTML5 Doctype** benötigen. Wir werfen also den `.col-wrapper` raus, drehen `.col-left` und `.col-main` und den Wrapper `.main` entfernen wir ebenfalls, da es eine Doppelung zu `.main-container` ist.
```html,php
<!DOCTYPE html>
<head>
    <?php echo $this->getChildHtml('head') ?>
</head>
<body<?php echo $this->getBodyClass()?' class="'.$this->getBodyClass().'"':'' ?>>
    <?php echo $this->getChildHtml('after_body_start') ?>
    <div class="wrapper">
        <?php echo $this->getChildHtml('global_notices') ?>
        <div class="page">
            <?php echo $this->getChildHtml('header') ?>
            <div class="main-container col3-layout">
                <?php echo $this->getChildHtml('breadcrumbs') ?>
                <div class="col-left sidebar"><?php echo $this->getChildHtml('left') ?></div>
                <div class="col-main">
                    <?php echo $this->getChildHtml('global_messages') ?>
                    <?php echo $this->getChildHtml('content') ?>
                </div>
                <div class="col-right sidebar"><?php echo $this->getChildHtml('right') ?></div>
            </div>
            <?php echo $this->getChildHtml('footer') ?>
            <?php echo $this->getChildHtml('global_cookie_notice') ?>
            <?php echo $this->getChildHtml('before_body_end') ?>
        </div>
    </div>
    <?php echo $this->getAbsoluteFooter() ?>
</body>
</html>
```
Und zack haben wir wieder eine "ordentliche" Struktur. War doch **Easy**, oder? 

### Das Product Grid:
Jetzt bringen wir, mit ein paar Zeilen, das Produkt-Grid noch fix in Ordnung. Um die Flexibilität zu verdeutlichen können wir hier eine andere Gutter-Breite nutzen, mehr dazu weiter Unten.
```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- page
        |- catalog
            |- product
                |- __grid.scss
```
Und in unserer `styles.scss` ergänzen wir wieder `@import "catalog/product/__grid";` Spätestens jetzt seht ihr auch wo die Reise mit den Ordner hin geht, wir können im SCSS eine ähnliche **Ordner-Struktur** abbilden wie wir sie in den Magento-Templates vorfinden, dies erleichtert später die Suche nach Styles.

Und hier die `__grid.scss` für **Produkte**:
```scss
.products-grid {
    $grid-gutter-width--product: $grid-gutter-width * 2 !default;

    list-style: none;
    padding: 0;

    @extend .row;

    .item {
        @include make-md-column(6, $grid-gutter-width--product);
    }
}
```

### Buttons:
Wenn wir jetzt noch die Buttons ein wenig hübsch machen, haben wir schon fast wieder einen benutzbaren Shop. Die Buttons sind natürlich über den gesamten Shop global, also setzen wir diese direkt in den `root` SCSS Order.
```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- _buttons.scss
        |- ...
```
Und in unserer `styles.scss` ergänzen wir `@import "_buttons";`

```scss
.button {
    @extend .btn;

    &.btn-cart {
        @include button-variant(
            #ffffff,
            #b368d6,
            #623C7B
        );
    }
}
```
Wenn wir jetzt eine gut **konfigurierbare Boilerplate** bauen wollen, müssen wir aber das Beispiel noch weiter modifizieren, denn durch die feste Angabe von Color-Codes haben wir unbewusst einen statischen Style gebaut. 

Wir erweitern also unsere Variablen in der `styles.scss` wie folgt.
```scss
// Eine neue Farbe für den "Add to cart" Button
$brand-buy:             #b368d6 !default;
$brand-base:            #ffffff !default;
```
Und das Beispiel des Button-Mappings so:
```scss
.button {
    $button-text-default:   $brand-base !default;
    $button-bg-buy:         $brand-buy !default;
    
    @extend .btn;

    &.btn-cart {
        @include button-variant(
            $button-text-default,
            $button-bg-buy,
            darken($button-bg-buy, 50%)
        );
    }
}
```
Nun haben wir **Scope-Variablen** die nur innerhalb der Buttons benutzt werden und ihre Werte aus den **Standard-Variablen** erben. Weiterhin haben wir in dem Mixin `button-variant()` die Color-Codes durch die Scope-Variablen ersetzt und die Border (der dritte Parameter) über die Funktion `darken()` verdunkelt.
Damit haben wir die Möglichkeit geschaffen die Buttons von Außerhalb durch die Standart-Variablen zu ändern oder aber auch durch die Scope-Variablen im Modul.

### Das Ende:
Sicherlich ist nun klar wie man sich mit wenigen Mitteln eine gute Basis schaffen kann, dass man einiges an Arbeit vor sich hat um ein so komplexes System komplett zu Mappen ist jedoch absehbar. 

Um ein solches Vorhaben bis zum Ende zu bringen empfiehlt es sich iterativ vorzugehen, d.h. wir nehmen uns die alte Magento `styles.css`, werfen einige generelle Klassen raus und importieren den Rest in die neue `styles.scss`. Ihr könnt diese Datei als CSS und mit normalen `@import` einbinden oder aber die Dateiendung in scss umändern aber dies überlasse ich euch. Wichtig ist nur, dass ihr den Dateiname in sowas wie **magento-lagacy** ändert, damit ihr sie später auch wieder findet. Nun können die Klassen und Styles nach und nach ausgetauscht werden.

Weitere wichtige **Mixins** könnten z.B. die folgenden sein.

- `alert-variant($background, $border, $text-color);` für die Magento Messages
- `img-responsive($display: block)` für Bilder 
- `clearfix()`
- `border-top-radius($radius)` gibt es auch für "right", "left" und "bottom" 
- `table-row-variant($state, $background)` 

Ein Blick in die Datei `_utilities.scss` erleichtert einem auch oftmals das Leben, wenn man anfängt Kleinigkeiten als neue Styles zu definieren.

Das Komplette Theme zu diesem Artikel könnt ihr euch in meinem [Git-Repository "Magento Bootstrap"](https://github.com/toh82/Magento_Bootstrap_Article) herunterladen. 

Autor
----------------------
Tobias Hartmann ([@ToH_82](https://twitter.com/ToH_82)) lebt in der Nähe von Frankfurt am Main und arbeitet seit 2014 bei [Sitewards](http://www.sitewards.com/) als Frontend-Entwickler für Magento Projekte. Zuvor arbeitete er bei Kreativ-Agenturen, sowohl als Staatl. geprüfter Gestalter wie auch als Frontend-Entwickler.