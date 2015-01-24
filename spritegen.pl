#!/usr/bin/env perl

use strict;
use warnings;
use diagnostics;

my $json = "{ \"frames\": {";

# Configuration
my $width       = 256; # How many pixels wide is the sheet?
my $rows        =   8; # How many rows of blocks are there?
my $tile_width  =  16; # How wide are the tiles?
my $tile_height =  16;
my $filepath    = 'public/assets/tiles.png';
my $outfile     = 'tiles.json';

my $height = $rows * $tile_height;
my $index = 1;

for(my $row = 0; $row < $rows; $row++)
{
    for(my $column = 0; $column < $width / $tile_width; $column++)
    {
        $index++;
        my $x = $column * $tile_width;
        my $y = $row * $tile_width;

        $json .= "\"tile_$index\": {";
        $json .= "\"frame\": {\"x\": $x, \"y\":$y, \"w\":$tile_width, \"h\":$tile_width},";
        $json .= "\"rotated\": false, \"trimmed\": false,";
        $json .= "\"spriteSourceSize\": {\"x\": 0, \"y\":0, \"w\":$tile_width, \"h\":$tile_width},";
        $json .= "\"sourceSize\": {\"w\":$tile_width, \"h\":$tile_width}";
        $json .= "},";
    }
}

chop($json);

$json .= "},";
$json .= "\"meta\": {";
$json .= "\"image\": \"$filepath\",";
$json .= "\"format\": \"RGBA8888\",";
$json .= "\"size\": {\"w\":$width, \"h\":$height},";
$json .= "\"scale\":1";
$json .= "}}";

open(my $fh, '>', $outfile);
print $fh $json;
close $fh;

