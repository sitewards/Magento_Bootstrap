
How to: Magento Frontend mit Bootstrap SCSS
======================

Einleitung
----------------------
Mit jedem Boilerplate Theme das auf einem Framework basiert kommen auch oft eine große Anzahl an Überschreibungen auf uns zu, erst recht wenn es um ein so komplexes System wie Magento geht. Ein wenig besser wird es, wenn wir statt dem normalen Bootstrap CSS Less oder SASS benutzen aber um eine wirklich saubere Basis zu bekommen empfielt es sich im ersten Schritt auf weitestgehend alles vorhandene zu verzichen und nur das Magento HTML als Basis zu sehen. Ja, es ist viel Arbeit aber es zahlt sich aus, zumindest Gedanklich dieses Experiment zu machen, denn durch die einige wirklich hilfreiche Mixins ist es einfacher als man denkt.

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
Als nächstes müssen wir das bisherige Magento CSS entfernen und den Pfad zum laden der neuen CSS setzen, dazu bemühen wir die local.xml des Themes.

```
app/design/frontend/[yourPackage]/default
    |- layout
        |- local.xml
```

```xml
<default>
    <reference name="head">
        <!-- Entferne Magento Dateien -->
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
        
        <!-- Diesen Block behalten wir
        <action method="removeItem">
            <type>skin_css</type>
            <name>css/styles.css</name>
        </action>
        -->
        
        <!-- Lade Bootstrap JS Dateien -->
        <action method="addItem">
            <type>skin_js</type>
            <name>js/script.js</name>
        </action>
    </reference>
</default>
```

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
Da wir in Bootstrap mehrere Javascript komponenten nutzen wollen können wir diese über den "js" Task zusammenschreiben und im "js" Ordner ablegen, welche Module benutzt werden sollen muss im "src" des Tasks angegeben werden wie im Beispiel das "Modal". Schön hieran ist, dass wir kontrollieren können wie groß unsere JavaScript Datei am Ende wird und wir Laden nur wirklich benötigte Module.

Ansonsten haben wir einen Task zum entfernen der dynamischen ordner "css" und "js" und einen Task für das Zusammenfassen der SCSS-Dateien. Für SCSS müssen wir in der Gulp-Datei keine Module oder Dateien aus dem Bootstrap Ordner angeben, dies erledigen wir später in der Styles.scss.

###### Die Package Datei mit allen benötigten Gulp-Modulen:
Die Package Datei benötigen wir um alle Gulp-Module zu Installieren, d.h. egal wo wir mit diesem Code arbeiten durch das ausführen von `npm install` werden alle benötigten Module installiert. Die Vorraussetzung hierfür ist aber das Node inkl. dem NPM installiert ist.

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
Nun kommen wir zur "Style" Datei, sozusagen dem Herzstück unseres Themes. Um herauszufinden welche Bootstrap Standard Dateien wir benötigen können wir im assets Ordner nach der Datei "_bootstrap.scss" suchen. Wir könnten diese Datei auch direkt in unserer Styles.scss mit `@import` einbinden dabei würden wir aber wieder sämliche komponenten laden, was in den meisten Fällen aber unnötig ist. In der Bootstrap Datei befinden sich glücklicher Weise Kommentare welche uns helfen zu indentifizieren was wir benötigen und was nicht, alles was mit "Components" beschrieben ist, ist Optional, alles andere wird drigend benötigt.



Mappings, Magento CSS, Tipps und Tricks
----------------------

- Breakpoints von Bootstrap einfacher nutzen?

- Seitenbereiche mit Bootstrap belegen inkl. Screenshots: 
-- make-row(), 
-- make-column(), 
-- etc.

- Extend mixins

- Bootstrap Buttons mit eigenen Sytles Erweitern?

- Zusammenfassung