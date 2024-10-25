# Compare 3D Print Profiles

Use this template to compare 3D print profiles from different slicers. Current slicer programs the template can use:

1. Slic3r
2. Simplify3D
3. PrusaSlicer


If the slicer used is one of the above, you're can use this template as is. But, if not; before using ensure that:

1. the slicer program exports gcode with the print settings commented out in the sliced gcode file.
2. the slicer exports it's printing profiles as human readable data.


## Adding a New Slicer Program:

If one of the two conditions above is met, this template can be used as is if the assignment character in the exported gcode is a `=` character, and the slicer exports 3D print profiles as either and `.ini`, `.fff`, or `.xml` file. Also, if `.ini` files are used for exporting printer profiles, the assignment character needs to be a `=` character to use as is. For best results configure for the slicer. In most cases a line for the slicer can be added to the config file `config/slicerPrograms.json`. If needed a **script file** may be needed if an assignment character other than the `=` character is used to assign values to the print profile properties.
<br><br>
To add a new profile input the name of the slicer (_with no space_) as the property, and the assignment character as the value in `config/slicerPrograms.json`.  
If needed modify the assignment character (_use `Simplify3D` as a guide_) and add a custom php script file in the `scripts` folder using the property name from `config/slicerPrograms.json` as the php file name. For instance `"Simplify3D" : "--,--"` has a script file name `Simplify3D.php`. For `Simplify3D` **--,--** was used as assignment character instead of **,** (_actual assignment character_) as some properties used a comma character in the value. 
<br><br>
If adding a script file you'll have to modify it so that the assignment character can split the property name from the property value for the 3D printing progile. In the case of `Simplify3D`:

1. new lines are temporarily replaced with a marker.
2. the marker is formated so that when new lines are added the properties and values can be extracted using the first assignment operatore - `,`.
3. the first assignment character `,` is replaced with `--,--` after the new lines are added back.
3. the first three lines, and the last line are deleted.


## Adding gcode and 3D Print Profiles:
Add `gcode`, `ini`, `fff`, and `xml` files to the parse folder. File names can contain space, or be numerical. If using numerical files only use numbers for the file names, and ensure that they are in sequential order and do not duplicate a numeric file e.g. 1.gcode and 1.ini.
If files are not in order and sequential they will be parsed in the order they were output from the terminal using the script file `scripts/file_count.php`.


## To Use:

This can be used in codespaces, or cloned/downloaded locally, then used with `localhost:PORT`. The below snippet (_copy/paste_) should suffice in either case:
<br>
NOTE - will be a bit buggy in GitHub codespaces.


```markdown
php -S localhost:9090
```

Once the app starts:

1. select the top dropdown to select folder nested in parse i.e. `parse/gcode`. 
   If print profiles to compare are in root of `parse` no need to select from top dropdown.
2. from the bottom 4 dropdown select the print profile to view.
3. to compare profiles select more than one and click **Show Difference**.
   NOTE - this will only work if the files were derived from same slicer and same number of properties
   