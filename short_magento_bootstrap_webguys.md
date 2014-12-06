**Magento Frontend mit Bootstrap SCSS**
======================
Mit jedem Boilerplate Theme welches auf einem Framework basiert kommen auch oft eine große Anzahl an Überschreibungen auf uns zu, erst recht wenn es um so komplexe Systeme wie [Magento](http://magento.com/) und um ein Framework wie [Bootstrap](http://getbootstrap.com/) geht.  
Ein wenig besser wird es, wenn wir statt dem normalen **Bootstrap CSS** zu [**less**](http://lesscss.org/) oder [**SASS**](http://sass-lang.com/) greifen aber um eine wirklich saubere Basis zu bekommen empfiehlt es sich im ersten Schritt auf weitestgehend alles vorhandene zu verzichten und **nur das Magento HTML als Basis** zu sehen.

Ja es ist viel Arbeit aber es zahlt sich aus zumindest Gedanklich dieses Experiment zu machen, denn durch die einige wirklich hilfreiche Mixins ist es einfacher als man denkt.

Da ich keineswegs von Boilerplates abraten will, möchte ich an dieser Stelle die Webcomm [HTML5 Magento Bootstrap Boilerplate](https://github.com/webcomm/magento-boilerplate) hervorheben, mit der ich sehr gute Erfahrung sammeln konnte. Neben einer sehr guten integration finden wir hier sehr gute CSS Klassen-Mappings zwischen Magento und Bootstrap.

**Und los geht's**
----------------------
Wir könnten natürlich nun, wie es so manch erster Gedanke zu diesem Thema ist, die ganzen `.phtml` Dateien von Magento ändern und **Bootstrap CSS-Klassen** einfügen aber wir wollen möglichst wenig an diesen Dateien verändern. Für einige wenige Templates könnte man dies natürlich machen aber wann hört es auf? Wichtig ist bei dem Einsatz eines Frameworks wie **Bootstrap** dass man möglichst viel davon benutzt, damit man das ohnehin schon große Stylesheet nicht noch zusätzlich aufbläht. 

Die Lösung der benannte Probleme ist wie angedeutet der Einsatz einer Präprozessor Sprache wie **SASS/SCSS** oder **less**. Da Bootstrap mittlerweile **SASS/SCSS** auch offiziell unterstützt, kann man sich hier sein Mittel der Wahl aussuchen, ich persönlich tendiere aber zu **SASS/SCSS**, da mir die Syntax angenehmer ist, ich bisher alles in SCSS mache und die Community aktiver zu sein scheint.

Nun gibt es hier erstmal ein wenig mehr Vorarbeit zu leisten als einfach eine CSS-Datei an Ort und Stelle zu kopieren.

### 1. Bootstrap aufsetzen
Der einfache Weg ist, die gewünschten Bootstrap Version als gepackte Datei herunter zu laden und in ein Magento Theme Package einzufügen. Dazu wählt man auf der [Bootstrap Download-Page](http://getbootstrap.com/getting-started/#download) zwischen den Optionen "Source Code" (Less) oder der SASS/SCSS Variante. 

Bootstrap liefert hier ein komplette Paket mit unter Anderem einem [Bower-file](http://bower.io/), welches das updaten der Bootstrap Dateien vereinfacht, in so fern man Bower nutzen will. Wenn Bower nicht genutzt wird und auch nichts von den anderen Möglichkeiten die Bootstrap hier mitliefert, reicht uns der Ordner "assets" vollkommen aus. 

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
Die Ordner `css`, `js` und `fonts/bootstrap` sind unsere dynamisch befüllten Ordner. Im Ordner `scss` werden im späteren Verlauf die Style Änderungen gemacht.

### 2. Magento Dateien entfernen und Bootstrap laden
Als nächstes müssen wir in der `local.xml` des neuen Magento Themes die Meta-Tags für `viewport` und `http-equiv X-UA-Compatible` einfügen und das bisherige Magento CSS und weitere störende Dateien entfernen. Die Einbindung der Datei `styles.css` kann bestehen bleiben da wir später genau diese Datei dynamisch ausliefern werden um den Theme-Fallback nicht zu brechen.

Wir benötigen jetzt also folgende Datei:
```
app/design/frontend/bootstrap/default
    |- layout
        |- local.xml
```
Im Folgenden Beispiel der `local.xml` entfernen wir auch JavaScript welche in ähnlicher oder vielleicht sogar besserer Form in Bootstrap verfügbar sind wie z.B. das JS Menü.
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
Weiterhin haben wir mit Hilfe der neuen Fallback-Konfiguration in der Datei `app/design/frontend/bootstrap/default/etc/theme.xml` das Theme auf `default/default` aufgebaut, damit wir im Frontend weiterhin ein paar bunte Bildchen sehen. Generell ist es natürlich möglich das neue Theme sogar auf dem RWD-Theme aufzusetzen, hier muss nur beachtet werden das wir schon den `HTML5` Doctype und das Meta-Tag für `viewport` im `head` und das noch andere CSS-Dateien gegebenenfalls entfernt werden müssen.

### 3. Kompilierung der Bootstrap SCSS- und JS-Dateien
Um die Bootstrap Komponenten nun vom Assets-Ordner zu JS und CSS Dateien zu Kompilieren nutzen wir [Gulp](http://gulpjs.com/) und einfache Gulp-Tasks, einfach deshalb weil wir hier auf "uglify, minify etc. verzichten". Das **Gulp-File**, die Konfigurations-Datei für Tasks, legen wir für unser Beispiel ebenfalls im Theme-Ordner ab, genauso wie die [NPM](https://www.npmjs.org/) **Package-Datei** zum Installieren der Gulp-Module.
```
skin/frontend/bootstrap/default
    |- gulpfile.js
    |- package.json
```
Wer sich bisher nicht mit diesem Workflow vertraut gemacht hat findet auf Google mit den Keywords "SASS, Gulp, Bootstrap" sehr schnell Hilfe. Im Groben ist die Installation, zumindest unter Windows, sehr einfach:

1. [Node](http://nodejs.org/) installieren
2. Da NPM zusammen mit Node installiert wurde nun einfach die Konsole öffnen und mit der Eingabe von `npm --version` schauen ob es korrekt installiert wurde.
3. Gulp global installieren `npm install -g gulp`.
4. Testen ob Gulp korrekt installiert wurde `gulp --version`
5. Party
 
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

Um sicher zu gehen das unsere dynamisch erstellten Dateien als erstes gelöscht werden benötigen wir den `clean` Task welcher als Abhängigkeit in jedem anderen Task gesetzt wird und somit als erstes ausgeführt wird.

Da wir in Bootstrap mehrere Javascript Komponenten nutzen wollen, können wir diese über den `js` Task zusammenschreiben lassen. Welche Module benutzt werden sollen, muss im `src` des Tasks angegeben werden wie im Beispiel das "Bootstrap-Modal". Schön hieran ist, dass wir kontrollieren können wie groß unsere JavaScript Datei am Ende wird und wir wirklich benötigte Module laden. Über weitere Gulp-Module wie z.B. [gulp-uglify](https://www.npmjs.org/package/gulp-uglify) kann man die JavaScript Module auch komprimieren oder auch über [gulp-jshint](https://www.npmjs.org/package/gulp-jshint) Testen.

Der `scss` Task für das Kompilieren der SCSS-Dateien benötigt nur die Angabe der Datei `styles.scss` denn alle weiteren Dateien werden in der besagten SCSS-Datei verknüpft. Auch hier haben wir mit weiteren Gulp-Modulen die Möglichkeit mehr als nur CSS zu erstellen, hier ein paar Beispiele:

- Komprimieren mit [gulp-minify-css](https://www.npmjs.org/package/gulp-minify-css)
- Aufteilung in mehere CSS-Dateien falls das Klassen-Maximum erreicht ist (IE) mit [gulp-bless](https://www.npmjs.org/package/gulp-bless)

#### Die Package Datei mit allen benötigten Gulp-Modulen:
Die Package Datei benötigen wir um alle Gulp-Module zu Installieren, d.h. egal wo wir mit diesem Code arbeiten durch das ausführen von `npm install` werden alle benötigten Module installiert.
```json
{
  "name": "bootstrap_magento_theme",
  "version": "0.0.1",
  "description": "Example of how to handle magento frontend together with bootstrap",
  "main": "gulpfile.js",
  "keywords": [
    "magento",
    "bootstrap",
    "sass",
    "scss",
    "theme",
    "boilerplate"
  ],
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
Nun kommen wir zur "Style" Datei, sozusagen dem CSS-Herzstück unseres Themes.

Um herauszufinden welche Bootstrap Standard Dateien wir benötigen, öffnen wir im Ordner `assets` die Datei `_bootstrap.scss`. Wir könnten diese Datei auch direkt in unserer `styles.scss` mit `@import` einbinden dabei würden wir aber sämtliche Komponenten laden, was in den meisten Fällen unnötig ist. In der Bootstrap Datei befinden sich glücklicher Weise Kommentare, welche uns helfen zu Identifizieren was wir benötigen und was nicht. Alles was mit "Components" beschrieben ist, ist Optional, alles 
andere wird dringend benötigt, easy.
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
Ich habe mir erlaubt schon mal die Stellen mit Kommentaren zu versehen an denen wir später unsere Styles und Module hinterlegen. 

Die Sektion **User Settings** wird dabei weitestgehend mit Variablen aus der Datei `skin/frontend/bootstrap/default/bootstrap/assets/stylesheets/bootstrap/_variables.scss` befüllt, welche dort auf das eigene Theme angepasst werden. Natürlich ist es auch ein perfekter Platz um eigene Variablen abzulegen, insofern diese Global verfügbar sein sollen. 

In der Sektion **Bootstrap Modules** führen wir alle Module auf welche wir später im Shop benutzen wollen. Eine Liste mit allen verfügbaren Modulen findet ihr in der Datei `skin/frontend/bootstrap/default/bootstrap/assets/stylesheets/_bootstrap.scss` unter dem Kommentar `// Components` und `// Components w/ JavaScript`.

Die Sektion **User Modules** ist den eigenen Modulen vorbehalten, von denen wir ein paar im Folgenden beschreiben werden.

### 5. Das erste Mal Gulp
Super, wir sind soweit, nun können wir unseren Code das erste Mal über Gulp in den CSS-, JS- und Font-Ordner schreiben lassen. Also nur Mut, `gulp` in die Konsole eingeben und Return/Enter drücken. Eure Konsole wird nun die Einzelnen Tasks ausgeben und am Ende sollten wir in den oben genannten Ordnern Dateien vorfinden.  

**SCSS, Mappings, Tipps und Tricks**
----------------------
Da wir in diesem Artikel keine komplette Boilerplate bauen wollen möchte ich hier nur auf ein paar der wichtigsten und hilfreichsten ["Mixin"](http://sass-lang.com/guide#topic-6) Funktionen eingehen. Ich denke auch dass mit diesen Tipps jeder in der Lage sein wird seine eigene individuelle Boilerplate zu bauen oder in den kommenden Projekten schneller bei der Integration von Bootstrap in Magento ist.

Damit wir ein wenig die **Ordnung** behalten, denn es können wirklich sehr sehr viele Mappings werden, empfiehlt es sich die Mappings nicht nur in eine, sondern in mehrere Dateien, auszulagern. Für mich hat sich dabei die folgende Struktur bewährt:
```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- _Globale-Klassen.scss
        |- Blockname
            |- _Block-Klassen.scss
            |- __Kind-Klassen.scss
```
Also für jeden Block für den es sich lohnt z.B. "Page", mache ich dabei einen eigenen Ordner auf. Darunter lege ich eine Datei ab, welche die Block-Klassen enthält und mit `__` gekennzeichnet Dateien welche jeweils einen Kind-Block enthalten.

### Bootstrap schön machen:
Da Bootstrap von vorn herein ein gewisses Styling mit sich bringt könnte man, falls dieses Styling passend ist, darauf verzichten die Konfiguration zu überschreiben. Wir wollen uns aber trotzdem zumindest anschauen wie es geht. 

Die Konfiguration nehmen wir direkt in der `styles.scss` vor und halten uns dabei an die Bootstrap-Variablen welche unter `bootstrap/assets/stylesheets/bootstrap/_variables.scss` zu finden sind. Ein paar der interessantesten habe ich im folgenden aufgezeigt.
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

// Eine neue Farbe für den "Add to cart" Button
$brand-buy:             #b368d6 !default;
```
Ihr seht also wir können anhand von wenigen Variablen Bootstrap massiv modifizieren und dies sollten wir auch nutzen. Wenn ihr über die `_variables.scss` geht fällt euch auch bestimmt `!default` ins Auge. Dies hat keineswegs irgendwas mit dem aus CSS bekannten `!important` zu tun, vielmehr bezeichnet es das der aktuelle Wert dieser Variable "Default" ist und überschrieben werden kann. Wenn Wert in einer Variable gesetzt wurde, wird er bei der benutzung von "Default" nicht erneut gesetzt (Überschrieben):
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
Wenn wir neue globale Variablen anlegen, sollten diese also immer die Bezeichnung `!default` bekommen damit für diese Variable einen Fallback haben.

### TODO :: Das Grid: 
Oh ha, jetzt geht's ans Eingemachte, falsch gedacht. Es ist einfacher als man denkt auf die bestehenden Magento Klassen das Bootstrap Grid zu mappen. Die Macher von Bootstrap waren nämlich so nett uns hierfür einige Mixins zu liefern. Ein super Vorteil davon ist, das der Shop gleich mal einen gewaltigen Schritt in Sachen Responsive nach vorn macht. 

Die Grid mixins könnt ihr in den Bootstrap assets in dieserm Ordner finden: `bootstrap\assets\stylesheets\bootstrap\mixins\_grid.scss`.
Also fangen wir an unser Magento Frontend wieder etwas in form zu bringen. Als erstes kümmern wir uns um die "Pages" also die generelle Seitenstruktur, dazu erweitern wir das SCSS wie folgt:
```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- page
            |- _grid.scss
```
und natürlich auch die `styles.scss` mit `@import "page/_grid";`.


In unserer _pages-grid.scss sammeln wir mal die wichtigsten gegebenen Struktur-Klassen und erweitern diese mit den zur Verfügung stehenden Mixins. Ich habe das im folgenden schonmal vorbereitet:

```scss
.page {
  @extend .container;
}

.main-container {
  @include make-row();

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

Leider müssen wir hier auch an die Magento Page-Templates ran. Deren HTML Struktur lässt nämlich ob im RWD-Theme oder im Default zu Wünschen übrig also reduzieren wir diese etwas und schieben vorallem die linke Spalte vor die Hauptspalte.
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

Hier ein Beispiel anhand der `3columns.phtml`. Nicht zu vergessen das wir einen HTML5 Doctype benötigen. Wir werfen also den `col-wrapper` raus und drehen `col-left` und `col-main` und den wrapper `main` entfernen wir ebenfalls da es eine doppelung zu `main-container` ist.
```html
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

Und zack haben wir wieder eine "ordentliche" Seitenstruktur, Easy, oder? Die mixins die uns hier das Leben erleichtern sind `make-row()` und `make-[breakpoint]-column()` als Parameter kann man diesen Mixins z.B. die Gutter-Breite übergeben womit wir in der Lage sind das Grid sogar für andere Blöcke anpassen kann. Das Mixin für "columns" `make-[breakpoint]-column()` erwarted zudem noch die Spaltenbreite als ersten Parameter. Wichtig ist hier zudem zu erwähnen das man in Bootstrap Grids verschachteln kann wichtig ist dabei nur dass diese wieder mit einer `row` umgeben sind. Wann immer ihr also eine weitere Grid-Struktur benötigt könnt ihr die Mixins benutzen wie z.B. im Product-Grid.
Warum benutze ich hier nicht z.B. `@extend .col-md-5`? Gute Frage, ich habe extra hierauf verzichted damit ich euch zeigen kann wie flexibel bootstrap sein kann. 

Außerdem ist extend nicht in der Lage die z.b. mediaqueries mit zu übernehmen was im ersten Moment durchaus graue Haare verursachen kann wenn man Stundenlang nach dem Problem sucht und keines findet.
- nicht mehr seid der version 1.2.0 von gulp-sass

```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- page
            |- _grid.scss
        |- catalog
            |- product
                |- _grid.scss
```
Und in unserer `styles.scss` ergänzen wir `@import "catalog/product/_grid";`

Spätestens jetzt seht ihr auch wo die Reise mit den Ordner hin geht, wir können im SCSS eine ähnliche Struktur abbilden wie wir sie in den Magento-Templates vorfinden, dies erleichtert später die Suche nach Styles.

Jetzt bringen wir mit ein paar Zeilen noch fix das Produkt-Grid etwas in Ordnung, um die Flexibilität zu verdeutlichen können wir hier eine andere Gutter-Breite nutzen.
```scss
.products-grid {
    list-style: none;
    padding: 0;

    @extend .row;

    .item {
        @include make-md-column(6, $grid-gutter-width * 2);
    }
}
```

Wenn wir jetzt noch die Buttons ein wenig hüpsch machen, haben wir schon fast wieder einen benutzbaren Shop. Die Buttons sind natürlich über den gesamten Shop global also setzen wir diese direkt in den `root` SCSS Order.

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
            $brand-buy,
            darken($brand-buy, 50%)
        );
    }
}
```

Sicherlich ist nun klar wie man sich mit wenigen mitteln eine gute basis schaffen kann, dass man einiges an Arbeit vor sich hat um ein so komplexes system komplett zu mappen ist jedoch logisch. Um es zu schaffen das system nach und nach umzubauen können wir die magento styles ebenfalls in unsere scss datei laden und immer wenn eine sektion überarbeitet ist, diese daraus entfernen.
Ihr könnt diese datei als CSS und mit normalen `@import` einbinden oder aber die dateiendung in scss umändern aber dies überlasse ich euch. 

Weiterhin für euch wichte mixins könnten z.B. die folgenden sein.
```scss
TODO: Interessante Mixins
```

Author
----------------------