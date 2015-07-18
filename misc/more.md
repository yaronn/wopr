**tl;dr**

`````bash
    $> curl -N tty.zone/[0-2]?auto\&cols=$((COLUMNS))
`````

## WOPR

A markup language for creating rich terminal reports, presentations and infographics.

Put an xml report on the web (e.g. gist) and view it via curl!

**Contributors:** Yaron Naveh ([@YaronNaveh](http://twitter.com/YaronNaveh))

##Demo##

<img src="../docs/images/charts.png" alt="term" width="800">

<img src="../docs/images/map.png" alt="term" width="800">

([xml source](https://raw.githubusercontent.com/yaronn/wopr/master/test/sample.xml))


You can view it from the web with no installation:

`````bash
    $> curl tty.zone?cols=$((COLUMNS))
    $> curl tty.zone/1?cols=$((COLUMNS))
`````

If you experience firewall issues replace tty.zone with ec2-23-21-64-152.compute-1.amazonaws.com.

You can also use a local viewer rather than curl:

`````bash
    $> npm install -g wopr
    $> curl https://raw.githubusercontent.com/yaronn/wopr/master/test/sample.xml > wopr-sample.xml
    $> wopr wopr-sample.xml
`````

##Writing your first terminal report##

Here is a simple report with a bar chart:

`````xml
    <document>
      <page>
        <item col="0" row="0" colSpan="5" rowSpan="4">
          <bar maxHeight="5" data-titles="A,B,C" data-data="2,5,3" />
        </item>
      </page>
    </document>
`````

You have 3 options to view this report:

**option 1: POST it to the wopr online viewer**

`````bash
    $> curl --data '<document><page><item col="0" row="0" colSpan="5" rowSpan="4"><bar maxHeight="5" data-titles="A,B,C" data-data="2,5,3" /></item></page></document>' tty.zone?cols=$((COLUMNS))
`````

If you experience firewall issues replace tty.zone with ec2-23-21-64-152.compute-1.amazonaws.com.

**option 2: POST it from external url**

Save the report content in some url (e.g. gist) and then:

`````bash
    $> a=$(curl -s https://gist.githubusercontent.com/yaronn/e6eec6d0e7adac63c83f/raw/50aca544d26a32aa189e790635c8679067017948/gistfile1.xml); curl --data "$a" tty.zone?cols=$((COLUMNS))
`````

(note you need the gist raw url)

If you experience firewall issues replace tty.zone with ec2-23-21-64-152.compute-1.amazonaws.com.

**option 3: via the local viewer**

Save the report xml to report.xml and then:

`````bash
    $> npm install -g wopr
    $> wopr report.xml
`````

Note the local viewer does not send anything online and does not require network.


##Markup Basics#

**Pages**

A document is a set of pages:

`````xml
    <document>
      <page>
        ...
      </page>
      <page>
        ...
      </page>
    </document>
`````

**Layout**

A page is a 12x12 grid in which you can position different widgets:

`````xml
    <document>
      <page>
        <item col="0" row="0" colSpan="3" rowSpan="3">
          <bar maxHeight="5" data-titles="A,B,C" data-data="2,5,3" />
        </item>
        <item col="5" row="9" colSpan="1" rowSpan="1">
          <box content="some text" />
        </item>
      </page>
    </document>
`````

Here, the bar widget is in the first column and row (0-based indexing) and spans three columns and rows.
The box element is in the same page but in a different position.


**Widgets**

The available widgets are the ones that exist in the [blessed](https://github.com/chjj/blessed) and [blessed-contrib](https://github.com/yaronn/blessed-contrib) projects.
You can infer the xml representation of a javascript widget using a simple convention. So this:

`````javascript
    blessed.widget({ string: "5"
                   , int: 1
                   , intArray: [1,2,3]
                   , stringArray: ["a", "b", "c"]
                   , multiArray: [ [1,2,3], [4,5,6] ]
                   , complexArray: [ {a: 1, b: [1,2] }, {a: 3, b: [3,4]} ]
                   , object: { innerProp: 1, multiArray: [ [1,2], [3,4] ] }
    })
`````

becomes this:
    
`````xml
    <widget string="5" int="1" intArray="1,2,3" stringArray="a,b,c" object-innerProp="1">
      <multiArray>
        1,2,3
        4,5,6
      </multiArray>
      <object-multiArray>
        1,2
        3,4
      </object-multiArray>
      <complexArray>
        <m a="1" b="1,2" />
        <m a="3" b="3,4" />
      </complexArray>
    </widget>
`````

You can also look at the [demo xml](https://raw.githubusercontent.com/yaronn/wopr/master/test/sample.xml) to get more samples.


##Viewing Reports##


Depending on how you use a report, you have a few ways to view it. On Windows you will probably only be able to use the third option and need to [install the fonts](http://webservices20.blogspot.com/2015/04/running-terminal-dashboards-on-windows.html) for best view.

**option 1: POST it to the wopr online viewer**

`````bash
    $> curl --data '<document><page><item col="0" row="0" colSpan="5" rowSpan="4"><bar maxHeight="5" data-titles="A,B,C" data-data="2,5,3" /></item></page></document>' tty.zone?cols=$((COLUMNS))
`````

If you experience firewall issues replace tty.zone with ec2-23-21-64-152.compute-1.amazonaws.com.

**option 2: POST it from external url**

Save the report content in some url (e.g. gist) and then:

`````bash
    $> a=$(curl -s https://gist.githubusercontent.com/yaronn/e6eec6d0e7adac63c83f/raw/50aca544d26a32aa189e790635c8679067017948/gistfile1.xml); curl --data "$a" tty.zone?cols=$((COLUMNS))
`````

(note you need the gist raw url)

If you experience firewall issues replace tty.zone with ec2-23-21-64-152.compute-1.amazonaws.com.

Tip: If you use url shortener (e.g. bit.ly) add the -L flag to curl to follow redirects.

**option 3: via the local viewer**

Save the report xml to report.xml and then:

`````bash
    $> npm install -g wopr
    $> wopr report.xml
`````

Note the local viewer does not send anything online and does not require network.


When using the online reports, you might need to adjust the slides size based on your font / resolution or use non-xterm. tty.zone supports the following query params:

`````bash
    tty.zone?\&cols=$((COLUMNS))\&rows=$((LINES-5))\&terminal=${TERM}
    
    //or use hard coded values
    //curl -N tty.zone?\&cols=200\&rows=50
`````

(note the backslashs in the query - required in most shells)

**Pages**

When viewing a report with the local viewer you can advance slides with the Return or Space keys.
When using the online viewer you have 2 options:

Option 1 - manually advance slides with Return or Space:

`````bash
    p=0; while true; do curl --data '<document>...</document>' tty.zone/$((p++))?cols=$((COLUMNS)); read; done
`````

Option 2 - auto advance slides after 5 seconds:

`````bash
    curl -N --data '<document>...</document>' tty.zone/[0-3]?auto\&cols=$((COLUMNS))
`````

Where 0 is the index of the first slide and 3 of the last slide. keep the brackets in the url they are not optional.

Tip: disable curl buffering with the -N flag

You can also view a specific slide:

`````bash
    curl --data '<document>...</document>' tty.zone/4?cols=$((COLUMNS))
`````

##License##
MIT


## More Information
Created by Yaron Naveh ([twitter](http://twitter.com/YaronNaveh), [blog](http://webservices20.blogspot.com/))
