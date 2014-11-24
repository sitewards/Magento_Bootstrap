How to Magento Frontend mit Bootstrap SCSS
======================

#### Einleitung
Mit jedem Boilerplate Theme das auf einem Framework basiert kommen auch oft eine große anzahl an Überschreibungen auf uns zu, erstrecht wenn es um ein so komplexes System wie Magento geht. Ein wenig besser wird es wenn wir statt dem normalen CSS Sprachen wie Less oder SASS benutzen aber um eine wirklich saubere Foundation zu bekommen empfielt es sich im ersten Schritt auf weitestgehend alles vorhandene zu verzichen und nur das Magento HTML als Basis zu sehen. Ja es ist viel Arbeit aber es zahlt sich auch zumindest Gedanklich dieses Experiment zu machen, denn durch die einige wirklich hilfreiche Mixins ist es einfacher als man denkt.

#### Bootstrap Themes wie Magento Bootstrap Boilerplate
Da ich keineswegs von Boilerplates abraten will, möchte ich an dieser Stelle eine Boilerplate mit der ich sehr gute Erfahrung sammeln konnte hervorheben, die Webcomm [HTML5 Magento Bootstrap Boilerplate](https://github.com/webcomm/magento-boilerplate). Neben einer sehr guten integration finden wir hier sehr gute Class-Mappings zwischen Magento und Bootstrap. Hier liegt aber auch wieder ein Nachteil des ganzen denn neben den Std. Bootstrap Styles kommen hier nun weitere Styles hinzu welche möglicherweise nicht so gewüncht sind und daher überschrieben werden müssen.

Eigene Bootstrap Extension erstellen
----------------------
Fangen wir also an unsere eigene, so gut wie möglich "no Cosmetic", Boilerplate aufzubauen. Hierfür empfiehlt sich ein Modul zu schreiben um die Grundsätzlichen Dateien zu laden. Da wir hier mit SASS oder Less arbeiten wollen müssen wir vorher eine geeignete Foundation schaffen. Für Projekte mit nur einem Theme ist das relativ einfach doch will ich hier einen evtl. interessanten Ansatz für ein Magento mit meheren Themes aufzeigen.

Usere Basisstruktur könnte also wie folgt aussehen:
```
root
  |- bower_components
  |- src [hier liegt unsere Magento installation]
    |- app
    |- skin
        |- frontent
            |- boilerplate
                |- default
                |- christmas
                |- newyear
  |- gulpfile.js
```
Der Grund die Komponenten und das Gulp-File komplett auszulagern liegt darin das beides Elemente sind welche wir
nur im Entwicklungsprozess benötigen.

#### Bower und Gulp zum bauen des Bootstraps
Da wir Bootstrap ggf. später immer wieder Updaten wollen eignet sich Bower um alle Komponenten zu laden, ein weiterer Vorteil davon ist, dass wir alle Bootstrap Komponenten einzeln für uns nutzen können. Da wir es möglich machen wollen die Bootstrap SCSS Dateien für mehere Themes zu Compilieren empfielt sich ein wenig in der Trickkiste von Gulp zu wühlen.

###### Ein Config-File für jedes Theme
Gulp ist in der Lage eine .json Datei zu laden welche wir als Konfigurations-Datei nutzen, für unsere Zwecke reicht es 
aus Nodes für `bootstrap` Komponenten und den Kompilierungs-Modus `mode` zu haben. Wichtige Bootstrap-Komponenten wie
`variables` werden wir später im Gulpfile bei jedem Theme hinzufügen.

```
boilerplate
    |- default
        - gulp-config.json
        
    |- christmas
        - gulp-config.json
        
    |- newyear
        - gulp-config.json
```

Hier ein Beispiel einer solchen `gulp-config.json`:
```json
{
    "mode": "dev",
    "bootstrap": {
        "scss": [
            "tables",
            "buttons",
            "carousel",
            "modals",
            "component-animations",
            "dropdowns"
        ],
        "js": [
            "transition.js",
            "collapse.js",
            "carousel.js",
            "dropdown.js",
            "modal.js"
        ]
    }
}
```


#### Das Modul für die Einbindung der kompilierten Dateien
Modul:
```xml
```

Modul - Config:
```xml
```

Modul - Observer:
```php
```

Modul - layout xml:
```xml
```

- Zusammenfassung