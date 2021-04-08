# wilderlist-mapbox-scripts

> Scripts for generating and publishing tilesets to Mapbox's Tiling Service for the Wilderlist web application.

## Setting up

1. Run `npm i` to install node dependencies
1. Create a `.env` file with the following included values:\
  ```
    MONGO_AUTH_SOURCE=XXXX>
    MONGO_DATABASE_NAME=XXXX>
    MONGO_URI=XXXX>
    MAPBOX_ACCESS_TOKEN=XXXX>
  ```
1. Run `npm run init_tileset_cli` to install Python dependencies and setup environment variables based on your `.env` file

### Generating datasets

Run the scripts found in the `buildJson` directory to build standard GeoJson files.

Use the [MTS Data Sync CLI](https://github.com/mapbox/mts-data-sync) to create line-delimited GeoJson files for each one.

```bash
    # example (if mtsds has already been installed and configured)
    # mtsds --convert mountains.json
```

MTS Data Sync can also be used to estimate processing costs.

##### Special notes for building trail datasets

1. Trail data should first be exported from the database with the query `{relId: {$exists: false}}`
1. They should then be read in locally using the script `buildJson/trailsStream.js`
1. They individual output folders can be merged into three seperate files using `buildJson/mergeTrails.js`. This creates a file for trails, roads, and unnamed dirt roads.
1. Roads and unnamed dirt roads can then be manually merged together by opening both in a text editor and copying the contents of roads into unnamed dirt roads.
1. Trail data may require additional manual mergeing (via copy and paste). See note in `mergeTrails.js`

### Editing recipes

Recipes can be edited for each dataset within the `/recipes` directory.

### Create a new tileset

Use the following scripts to publish a new tilest.

1. Add `MAPBOX_ACCESS_TOKEN` to environment:
    ```bash
    export MAPBOX_ACCESS_TOKEN=XXXX
    ```
1. Validate a generated dataset with:
    ```bash
    tilesets validate-source <PATH_TO_FILE>
    ```
1. Add the tileset source:
    ```bash
    tilesets upload-source <USERNAME> <TILESET_ID> <PATH_TO_FILE>
    # example:
    # tilesets upload-source wsoeltz campsites-usa-v1 campsites.jsonl
    ```
1. Create the tileset:
    ```bash
    tilesets create <USERNAME>.<TILESET_NAME> -r <PATH_TO_RECIPE> -n <NAME_OF_TILESET>
    # example:
    # tilesets create wsoeltz.wilderlist-layers-v1 -r recipes/wilderlist_layers_recipe.json -n "Wilderlist Layers v1"
    ```
1. Publish the tileset:
    ```bash
    tilesets publish <USERNAME>.<TILESET_NAME>
    # example:
    # tilesets publish wsoeltz.wilderlist-layers-v1
    ```

### Updating a tileset

1. Replace the data in the tileset:
    ```bash
    tilesets upload-source --replace <USERNAME> <TILESET_ID> <PATH_TO_FILE>
    # example:
    # tilesets upload-source --replace wsoeltz mountains-usa-v1 mountains.jsonl
    # tilesets upload-source --replace wsoeltz campsites-usa-v1 campsites.jsonl
    # tilesets upload-source --replace wsoeltz trails-usa-v1 trails.jsonl
    # tilesets upload-source --replace wsoeltz trail-roads-usa-v1 unnamed-dirtroads.jsonl
    ```
1. Update recipe:
    ```bash
    tilesets update-recipe <USERNAME>.<TILESET_NAME> <PATH_TO_RECIPE>
    # tilesets update-recipe wsoeltz.wilderlist-points-v1 recipes/wilderlist_points_recipe.json
    # tilesets update-recipe wsoeltz.wilderlist-trails-v1 recipes/wilderlist_trails_recipe.json
    ```
1. Publish the tileset:
    ```bash
    tilesets publish <USERNAME>.<TILESET_NAME>
    # tilesets publish wsoeltz.wilderlist-points-v1
    # tilesets publish wsoeltz.wilderlist-trails-v1
    ```
