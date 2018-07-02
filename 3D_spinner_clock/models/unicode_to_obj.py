# Andrew Craigie
# unicode_to_obj.py

import bpy
import os
import sys
import csv
import json

maxX = sys.float_info.min
minX = sys.float_info.max
maxY = sys.float_info.min
minY = sys.float_info.max

character = ""
extrude = 0.04
bevel = 0.02

characters = []

objforJSON = {
    'font': 'BFont',
    'emHeight': '',
    'characters': {}
    }

filename = "Latin.csv"
filepath = os.path.join(os.path.dirname(bpy.data.filepath), filename)

exportfolder = "export"
exportfolder = os.path.join(os.path.dirname(bpy.data.filepath), exportfolder)

exportObjs = True

emMax = sys.float_info.min
emMin = sys.float_info.max

emHeight = 0
emWidth = 0
emDepth = 0

with open(filepath, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        characterDef = {
            'code': row['Code'],
            'decimal': row['Decimal'],
            'description': row['Description'],
            'block': row['UnicodeBlock'],
            'x': '0.00',
            'y': '0.00',
            'width': '0.00',
            'height': '0.00',
            'depth': '0.00',
            'model': ''
        }
        characters.append(characterDef)
        

for char in characters:
    c = char['code'][2:]
    s = str(chr(int(c, 16)))
    
    maxX = sys.float_info.min
    minX = sys.float_info.max
    maxY = sys.float_info.min
    minY = sys.float_info.max
    maxZ = sys.float_info.min
    minZ = sys.float_info.max
    
    if(c != '0020' and c != '00A0'): # ignore space and non-breaking space
        
        bpy.ops.object.text_add()
        mytext = bpy.data.objects[len(bpy.data.objects) - 1]
        ob=bpy.context.object
        ob.data.body = s
        ob.data.extrude = extrude
        ob.data.bevel_depth = bevel

        bpy.ops.object.convert(target="MESH")

        mesh = mytext.data

        for vert in mesh.vertices:
            if (vert.co.x < minX):
                minX = vert.co.x
            if (vert.co.x > maxX):
                maxX = vert.co.x
            if (vert.co.y < minY):
                minY = vert.co.y
            if (vert.co.y > maxY):
                maxY = vert.co.y
            if (vert.co.z < minZ):
                minZ = vert.co.z
            if (vert.co.z > maxZ):
                maxZ = vert.co.z
            if (vert.co.y < emMin):
                emMin = vert.co.y
            if (vert.co.y > emMax):
                emMax = vert.co.y
                
        
                
        exportFileName = c + ".obj" 
        char['model'] = exportFileName       
        exportFilePath = os.path.join(exportfolder, exportFileName)
        
        if (exportObjs):
            bpy.ops.export_scene.obj(filepath=exportFilePath, 
                axis_forward='-Y',  #-Z 
                axis_up='-Z',        #Y
                use_selection=False, 
                use_normals=True, 
                use_uvs=True, 
                use_materials=True, 
                use_triangles=False,  
                global_scale=1.0)
                
        bpy.ops.object.delete()
        
        cWidth = maxX - minX
        cHeight = maxY - minY
        cDepth = abs(maxZ - minZ)
        
        centerX = (cWidth * 0.5)
        centerY = (cHeight * 0.5)
        centerZ = (cDepth * 0.5)
                    
        char['x'] = '{0:.4f}'.format(minX)
        char['width'] = '{0:.4f}'.format(cWidth)
        char['y'] = '{0:.4f}'.format(minY)
        char['height'] = '{0:.4f}'.format(cHeight)
        char['z'] = "0.0"
        char['depth'] = '{0:.4f}'.format(cDepth)
        char['centerX'] = '{0:.4f}'.format(centerX)
        char['centerY'] = '{0:.4f}'.format(centerY)
        char['centerZ'] = '{0:.4f}'.format(centerZ)
        
        
        objforJSON['characters'][c] = char
        
emHeight = abs(emMax - emMin)
objforJSON['emHeight'] =  '{0:.3f}'.format(emHeight)     
        
print("em height:%f min:%f max:%f" % (emHeight, emMin, emMax))
  
jsonstring = json.dumps(objforJSON, separators=(',', ':'), sort_keys=False, indent=4)


jsonfilename = "latin.json"
jsonfilepath = os.path.join(exportfolder, jsonfilename)


jf = open(jsonfilepath, "w")
jf.write(jsonstring)
jf.close()








