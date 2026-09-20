# Tools

These tools help import, convert, process, rename other files to complete a workflow of going from:

`Spreadsheet > Folders > Folders with media > Ready to publish`

… or something like that. 

Here are the tools at play:

## `nmgallery-ts-builder`

This is the final tool that takes a `build/` folder and generates data and media for copying into our app. 

It is expecting a `build/` folder with the following structure:
- `artists/` folder with sub-folders containing an `artist.json` file and media
- `exhibitions/` folder with sub-folders containing an `exhibition.json` file and media
- `projects/` folder with sub-folders containing a `project.json` file and media

Media would be pre-processed with `nmgallery-media-muxer` generating prefixed files and the expected `header` file.

## `nmgallery-media-muxer`

