use strict;
use warnings;
use diagnostics;

my $json = "{ \"frames\": {";

print "How many pixels wide is the sheet?\n";
my $width = <>;
chomp $width;

print "How many rows of blocks are there?\n";
my $rows = <>;
chomp $rows;

print "How wide are the tiles?\n";
my $tile_width = <>;
chomp $tile_width;

print "How high are the tiles?\n";
my $tile_height = <>;
chomp $tile_height;

my $height = $rows * $tile_height;
my $index = 1;

for(my $row = 0; $row < $rows; $row++)
{
    for(my $column = 0; $column < $width / $tile_width; $column++)
    {
        #print "Enter index for tile at row $row and column $column or nothing to break\n";
        #my $name = <>;
        #chomp $name;
        
        #last if $name eq "";
        
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

print "Enter the relative path to the sprite sheet\n";
my $filepath = <>;
chomp $filepath;

$json .= "\"meta\": {";
$json .= "\"image\": \"$filepath\",";
$json .= "\"format\": \"RGBA8888\",";
$json .= "\"size\": {\"w\":$width, \"h\":$height},";
$json .= "\"scale\":1";
$json .= "}}";

print "Generated json:\n============================= START ================================\n";
print $json;
print "\n============================== END =================================\n";









