#!/usr/bin/env perl

use strict;
use warnings;
use diagnostics;

my $json = "{ \"frames\": {";

# Configuration
my $width       = 300; # How many pixels wide is the sheet?
my $rows        =  12; # How many rows of blocks are there?
my $tile_width  =  30; # How wide are the tiles?
my $tile_height =  32;
my $filepath    = 'player.png';
my $outfile     = 'public/assets/player.json';

my $height = $rows * $tile_height;
my $index = 1;

for(my $row = 0; $row < $rows; $row++)
{
    for(my $column = 0; $column < $width / $tile_width; $column++)
    {
        my $x = $column * $tile_width;
        my $y = $row * $tile_height;

        $json .= "\"player_$index\": {";
        $json .= "\"frame\": {\"x\": $x, \"y\":$y, \"w\":$tile_width, \"h\":$tile_height},";
        $json .= "\"rotated\": false, \"trimmed\": false,";
        $json .= "\"spriteSourceSize\": {\"x\": 0, \"y\":0, \"w\":$tile_width, \"h\":$tile_height},";
        $json .= "\"sourceSize\": {\"w\":$tile_width, \"h\":$tile_height}";
        $json .= "},";

        $index++;
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

