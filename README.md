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

Run the script `npm run build:<SOURCE_TYPE>` where `<SOURCE_TYPE>` should be replaced with one of the following values:

- `mountains`

### Editing recipes

Recipes can be edited for each dataset within the `/recipes` directory.

### Create a new tileset

Use the following scripts to publish a new tilest.

1. Validate a generated dataset wtih:\
  ```bash
  tilesets validate-source <PATH_TO_FILE>
  ```
1. Add the tileset source:\
  ```bash
  tilesets upload-source <USERNAME> <TILESET_ID> <PATH_TO_FILE>
  ```
1. Create the tileset:\
  ```bash
  tilesets create <USERNAME>.<TILESET_NAME> -r <PATH_TO_RECIPE> -n <NAME_OF_TILESET>
  ```
1. Publish the tileset:\
  ```bash
  tilesets publish <USERNAME>.<TILESET_NAME>
  ```

### Updating a tileset

1. Replace the data in the tileset:\
  ```bash
  tilesets upload-source --replace <USERNAME> <TILESET_ID> <PATH_TO_FILE>
  ```
1. Update recipe:\
  ```bash
  tilesets update-recipe <USERNAME>.<TILESET_NAME> <PATH_TO_RECIPE>
  ```
1. Publish the tileset:\
  ```bash
  tilesets publish <USERNAME>.<TILESET_NAME>
  ```
