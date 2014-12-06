How to: Magento Frontend mit Bootstrap SCSS
======================

Einleitung
----------------------
Mit jedem Boilerplate Theme das auf einem Framework basiert kommen auch oft eine große Anzahl an Überschreibungen auf uns zu, erst recht wenn es um ein so komplexes System wie Magento geht. Ein wenig besser wird es, wenn wir statt dem normalen Bootstrap CSS Less oder SASS benutzen aber um eine wirklich saubere Basis zu bekommen empfiehlt es sich im ersten Schritt auf weitestgehend alles vorhandene zu verzichten und nur das Magento HTML als Basis zu sehen. Ja, es ist viel Arbeit aber es zahlt sich aus, zumindest Gedanklich dieses Experiment zu machen, denn durch die einige wirklich hilfreiche Mixins ist es einfacher als man denkt.

Da ich keineswegs von Boilerplates abraten will, möchte ich an dieser Stelle eine Boilerplate mit der ich sehr gute Erfahrung sammeln konnte hervorheben, die Webcomm [HTML5 Magento Bootstrap Boilerplate](https://github.com/webcomm/magento-boilerplate). Neben einer sehr guten integration finden wir hier sehr gute Class-Mappings zwischen Magento und Bootstrap. Hier liegt aber auch wieder der Nachteil des Ganzen, denn neben den Standard Bootstrap Styles kommen hier weitere Styles hinzu, welche möglicherweise nicht gewüncht sind und daher überschrieben werden müssen.

Get the thing running
----------------------
Zu Problemen mit dem Einsatz von Bootstrap CSS führen vorallem die unterschiedlichen Klassenbenennungen in Magento und die Frage wie man diese am besten mit den Bootstrap-Styles verbindet. Es liegt nahe alle Templates welche benötigt werden mit neuen Klassen zu versehen, dies ist aber die denkbar komplizierteste Lösung. Wenn man allerdings nur ein paar Templates anpassen muss könnte man es in Kauf nehmen? - Nein, denn das würde zudem bedeuten das man ein extrem großes Stylesheet hat von dem man evtl. nur das Grid und Buttons im Bestfall nutzt.

Die Lösung für dieses Problem, ohne länger auf dem Problem selbst rumreiten zu wollen, ist der Einsatz einer Präprozessor Sprache wie SASS oder LESS. Da Bootstrap mittlerweile SASS auch offiziell unterstützt, kann man sich hier sein Mittel der Wahl aussuchen, ich persönlich rate aber zu SASS bzw. SCSS. [TODO: Why] Natürlich gibt es hier ein wenig mehr Vorarbeit zu leisten als einfach eine CSS-Datei an Ort und Stelle zu kopieren.

### Bootstrap aufsetzen
Der "Einfache" Weg ist, die gewünschten Bootstrap Version als gepackte Datei herunter zu laden und in ein Theme einzufügen. Dazu wählt man auf der [Bootstrap Download-Page](http://getbootstrap.com/getting-started/#download) zwischen "Source Code" (Less) oder der SASS Variante, Bootstrap liefert hier das komplette Paket, mit u.a. einem [Bower-file](http://bower.io/) welches das updaten der Bootstrap Dateien vereinfacht, in so fern man Bower nutzen will. Wenn Bower nicht genutzt wird und auch nichts von den anderen Möglichkeiten die Bootstrap mitliefert, reicht uns der Ordner "assets" aus dem Bootstrap Paket. Eure Dateistruktur könnten nun wie folgt aussehen:

```
skin/frontend/[yourPackage]/default
    |- bootstrap
        |- assets
        |- ...
    |- scss
        |- styles.scss
    |- css
    |- js
```

Wir benötigen zusätzlich noch einen "scss" Ordner um unsere Anpassungen durchzuführen.

### Magento CSS entfernen und Bootstrap laden
Als nächstes müssen wir in der `local.xml` des neuen themes den header für `viewport` und `X-UA-Compatible` einfügen und das bisherige Magento CSS entfernen, die einbindung der datei `styles.css` kann bestehen bleiben da wir sie später nutzen werden.

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
            <!-- Ein paar Magento Default Dateien entfernen -->
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

            <!-- Lade Bootstrap JS Dateien -->
            <action method="addItem">
                <type>skin_js</type>
                <name>js/bootstrap.min.js</name>
            </action>

            <!-- Setze wichtige Einstellungen -->
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
Weiterhin habe ich mit der `etc/theme.xml` das theme auf `default/default` aufgebaut damit wir im Frontend weiterhin ein paar bunte Bildchen sehen, generell ist es natürlich möglich das neue theme sogar auf dem RWD-Theme aufzusetzen, hier muss nur beachtet werden das wir schon `HTML5` und `viewport` im header haben und einige andere css dateien entfert werden müssen.

### Kompilierung der Bootstrap CSS und JS Dateien
Um die Bootstrap Komponenten nun vom Assets-Ordner zu JS und CSS Dateien zu Kompilieren nutzen wir einfache Gulp-Tasks. Das Gulp-File legen wir für unser Beispiel ebenfalls im Theme-Ordner ab, genauso wie die NPM Package-Datei zum Installieren der Gulp-Module.
```
skin/frontend/[yourPackage]/default
    |- gulpfile.js
    |- package.json
```

###### Das Gulp-File:
```js
var gulp         = require('gulp'),
    less         = require('gulp-sass'),
    rimraf       = require('gulp-rimraf');

// SCSS
gulp.task('scss', function() {
    gulp.src('scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

// Bootstrap JavaScript
gulp.task('js', function() {
    return gulp.src([
            "bower_components/bootstrap/js/modal.js"
        ])
        .pipe(concat('bootstrap.min.js'))
        .pipe(gulp.dest('js/'));
});

// Clean
gulp.task('clean', function() {
    gulp.src([
        'css',
        'js'
    ],{read: false})
    .pipe(rimraf({
        force: true
    }));
});

gulp.task('default', ['clean', 'scss', 'js']);
```
Da wir in Bootstrap mehrere Javascript Komponenten nutzen wollen können wir diese über den "js" Task zusammenschreiben und im "js" Ordner ablegen, welche Module benutzt werden sollen muss im "src" des Tasks angegeben werden wie im Beispiel das "Modal". Schön hieran ist, dass wir kontrollieren können wie groß unsere JavaScript Datei am Ende wird und wir Laden nur wirklich benötigte Module.

Ansonsten haben wir einen Task zum entfernen der dynamischen ordner "css" und "js" und einen Task für das Zusammenfassen der SCSS-Dateien. Für SCSS müssen wir in der Gulp-Datei keine Module oder Dateien aus dem Bootstrap Ordner angeben, dies erledigen wir später in der Styles.scss.

###### Die Package Datei mit allen benötigten Gulp-Modulen:
Die Package Datei benötigen wir um alle Gulp-Module zu Installieren, d.h. egal wo wir mit diesem Code arbeiten durch das ausführen von `npm install` werden alle benötigten Module installiert. Die Voraussetzung hierfür ist aber das Node inkl. dem NPM installiert ist.

```json
{
  "name": "bootstrap_magento_theme",
  "version": "0.0.1",
  "description": "Example of how to handle magento frontend together with bootstrap",
  "dependencies": {
    "gulp": "^3.8.10",
    "gulp-sass": "^1.1.0",
    "gulp-rimraf": "^0.1.1"
  }
}
```

### Aufsetzen der Style SCSS
Nun kommen wir zur "Style" Datei, sozusagen dem Herzstück unseres Themes. Um herauszufinden welche Bootstrap Standard Dateien wir benötigen können wir im assets Ordner nach der Datei "_bootstrap.scss" suchen. Wir könnten diese Datei auch direkt in unserer Styles.scss mit `@import` einbinden dabei würden wir aber wieder sämtliche Komponenten laden, was in den meisten Fällen unnötig ist. 
In der Bootstrap Datei befinden sich glücklicher Weise Kommentare welche uns helfen zu Identifizieren was wir benötigen und was nicht, alles was mit "Components" beschrieben ist, ist Optional, alles 
andere wird dringend benötigt, easy.

```scss
// Core variables and mixins
@import "bootstrap/assets/stylesheets/bootstrap/variables";
@import "bootstrap/assets/stylesheets/bootstrap/mixins";

//-------------------
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
// User Components
// Hier kannst du weitere Komponenten einfügen je nachdem welche benötig werden.
@import "bootstrap/assets/stylesheets/bootstrap/dropdowns";
@import "bootstrap/assets/stylesheets/bootstrap/button-groups";
@import "bootstrap/assets/stylesheets/bootstrap/close";
@import "bootstrap/assets/stylesheets/bootstrap/modals";
//-------------------

// Utility classes
@import "bootstrap/assets/stylesheets/bootstrap/utilities";
@import "bootstrap/assets/stylesheets/bootstrap/responsive-utilities";

//-------------------
// Deine SCSS Dateien sollten später hier eingefügt werden:
//-------------------
```

### Das erste Mal
Cool, wir sind soweit, nun können wir unseren Code das erste Mal über Gulp in den CSS und JS Ordner schreiben lassen und uns dann endlich den wichtigen Themen widmen.

Also einfach mutig sein, `gulp` in die Konsole eingeben und Return/Enter drücken. 

Mappings, Magento SCSS, Tipps und Tricks
----------------------
Da wir keine komplette Boilerplate bauen wollen möchte ich hier nur auf ein paar der wichtigsten und hilfreichsten eingehen Mappings eingehen. Ich denke auch das mit diesen Tipps jeder in der Lage ist seine eigene individuelle Boilerplate zu bauen oder in den kommenden Projekten schneller bei der Integration von Bootstrap in Magento ist.

Damit wir ein wenig die Ordnung behalten, denn es können wirklich sehr sehr viele Mappings werden, empfiehlt es sich die Mappings nicht nur in eine sonderen in mehrere Dateien auszulagern. Für mich hat sich dabei die folgende Strukur bewährt:
```
skin/frontend/bootstrap/default
    |- scss
        |- styles.scss
        |- _Globale-Klassen.scss
        |- Blockname
            |- _Block-Klassen.scss
            |- __Kind-Klassen.scss
```
Also für jeden Block für den es sich lohnt, mache ich dabei einen eigenen Ordner auf, lege darunter eine Datei ab welche die Block-Klassen enthält und mit `__` gekennzeichnet Dateien welche jeweils ein Kind-Block enthält.

### Bootstrap schön machen:
Es macht total Sinn Bootstrap erstmal ein wenig zu konfigurieren damit es dem entspricht was man erwarted. Diese Konfiguration nehmen wir direkt in der `styles.scss` vor und halten uns dabei and die Bootstrap-Variablen welche unter `bootstrap\assets\stylesheets\bootstrap\variables.scss` zu finden sind. Ein paar der wichtigsten habe ich im folgenden Beispiel ein wenig vorkonfiguriert.
```
$grid-columns:      12;
$grid-gutter-width: 30px;

$brand-primary:     darken(#428bca, 6.5%);
$brand-success:     #5cb85c;
$brand-info:        #5bc0de;
$brand-warning:     #f0ad4e;
$brand-danger:      #d9534f;

// Eine neue Farbe für den "Add to cart" Button
$brand-buy:         #b368d6 !default;
```

TODO: `!default` beschreiben und weitere variablen z.B. fürs Grid

### Das Grid: 
TODO: @import "_buttons";
      @import "page/_grid";
      @import "catalog/product/_grid";

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
skin/frontend/[yourPackage]/default
    |- scss
        |- styles.scss
        |- page
            |- _grid.scss
        |- catalog
            |- product
                |- _grid.scss
```

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
        |- page
        |- catalog 
```

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