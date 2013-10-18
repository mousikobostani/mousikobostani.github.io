#!/usr/local/bin/perl

#!/usr/bin/env perl                    

#!/usr/bin/perl -T 


############################################################
#                       SEARCH_ENGINE.CGI
#
# This script was written by Gunther Birznieks
# Date Created: 4-18-96
#
#   You may copy this under the terms of the GNU General Public
#   License or the Artistic License which is distributed with
#   copies of Perl v5.x for UNIX
#
# Purpose: Provides a mechanism to allow a user to search an entire
# directory structure for keyword(s) on the internet.
#
# Main Procedures:
#   
# Inputs:
#   Form Variables: 
#     keywords = keywords to search for
#     exact_match = "on" if the search is exact rather than pattern
#                   match based
#
# Outputs:
#   A Form for entering a keyword if keywords is NULL
#   Otherwise, A page of results from the search
#
############################################################


#$| = 1; # Set output to flush directly (for troubleshooting)

#BNB SAYS! put the UNIX path to where this directory is located
# $lib = "/usr/dom/xbignose/cgi-bin/3.0"; # Default path for loading libraries
$lib = "/home/public/earlabor_html/subdomains/ambiant/cgi-bin/3.0/";

require "$lib/cgi-lib.pl";

# Define Server specific variables
require "$lib/search_define.pl";

# The following outputs the CGI Header
print &PrintHeader;

# Get the form variables
&ReadParse;

$keywords = $in{'keywords'};
$exact_match = $in{'exact_match'};

# Take the keywords that were entered and parse them into an array
# of keywords based on word boundary (\s+ splits on whitespace)

@keyword_list = split(/\s+/,$keywords);

# If the person has not yet entered a search term, output a form that
# will ask them for a search word.

if ($keywords eq "") {
    &PrintNoKeywordHTML;
    exit;
} # End of if keywords

# Begin to send back the dynamic search results page with the header.

&PrintHeaderHTML;

#
# We traverse the whole directory structure under $root_web_path
# and in doing so, we also parse the HTML files to see if they have
# the keywords and what their title is.
#
# The following sets up the initial variables
# @dirs is the array of directories as a placeholder for going back up
# the directory tree when we run out of files in a subdirectory.
# $cur_dir is the current directory number and is a reference to the @dirs
# array.
# 
# Directory Handles are straight ASCII and consist of "DIR" + $cur_dir

$number_of_hits = 0;
$cur_dir = 0;
@dirs = ($root_web_path);
opendir("DIR$cur_dir", $dirs[$cur_dir]);

$end_of_all_files = 0;

while (!($end_of_all_files)) {
    # The following is used to trace down the next file. If there is no
    # next file (the whole directory tree was traversed), $end_of_all_files 
    # is set to positive and then the whole process is ended.
    while (1) {
	$filename = &GetNextEntry("DIR$cur_dir", $dirs[$cur_dir]);
	$fullpath = "$dirs[$cur_dir]/$filename";
#
# CASE 1) File is null and but still can traverse back up the directory
#
	if (!($filename) && $cur_dir > 0) {
	    closedir("DIR$cur_dir");
	    $cur_dir--;
	    next;
	} 

#
# CASE 2) File is null but nowhere else to go.  So we end the searching.
#
	if (!($filename)) {
	    closedir("DIR$cur_dir");
	    $end_of_all_files = 1;
            last;
	} 

#
# CASE 3) File is a directory so traverse down it.
#
	if (-d $fullpath) {
	    if (-r $fullpath && -x $fullpath) {
		$cur_dir++;
		$dirs[$cur_dir] = $fullpath;
		opendir("DIR$cur_dir", $dirs[$cur_dir]);
		next;
	    } else {
		# Since the dir does not have r or x perms we go on
		next;
	    }	     
	} # End of Case 3 (File is directory

#
# CASE 4) The file is an unwanted file
#
	$unwanted_file = 0;

	foreach (@unwanted_files) {
	    if ($fullpath =~ /$_/) {
		$unwanted_file = 1;
	    }
	} # End of foreach unwanted files

	if ($unwanted_file) {
	    next;
	} # End of Case 4 Unwanted File

#
# CASE 5) The file is really something to search
#
	# So we break out of the while loop
	if (-r $fullpath) {
	    last;
	} # Make sure the file is readable

    } # End of While (1) 


    if (!($end_of_all_files)) {

# We set the not_found_words = to the array list and pick out
# words we find so that the not_found_words should not have
# anything in it if all the words were found.
#
	@not_found_words = @keyword_list;
	$are_we_in_head = 0;
	open(SEARCHFILE, $fullpath);
	$headline = "";
	while(<SEARCHFILE>) {
	    $line = $_;
	    $headline .= $line if ($are_we_in_head == 0);
	    $are_we_in_head = 1 
		if (($line =~ m!</head>!i) || ($line =~ m!</title>!i));
	    &FindKeywords($exact_match, $line, *not_found_words);
	} # End of SEARCHFILE
	close (SEARCHFILE);

	if (@not_found_words < 1) {
# Isolate out the <TITLE></TITLE> information

$headline =~ s/\n/ /g;
$headline =~ m!<title>(.*)</title>!i;
$title = $1;

	if ($title eq "") {
	    $title = "No Title Given";
	}
$fullpath =~ s!$root_web_path/!!;

&PrintBodyHTML($fullpath, $title);
$number_of_hits++;

} # If there are no not_found_words

} # If Not The End of all Files
} # End of While Not At The End Of All Files


# Print up the footer

if ($number_of_hits == 0) {
&PrintNoHitsBodyHTML;
}

&PrintFooterHTML;

############################################################
#
# subroutine: FindKeywords
#   Usage:
#     &FindKeywords("on", $line, *not_found_words);
#
#   Parameters:
#     $exact_match = "on" if we are not pattern matching
#     $line = line to search on
#     *not_found_words = array of keywords that have not 
#                        matched yet
#
#   Output:
#     *not_found_words will have keywords spliced out of it
#     as they are found.
# 
############################################################

sub FindKeywords
{
    local($exact_match, $line, *not_found_words) = @_;
    local($x, $match_word);

    if ($exact_match eq "on") {
	for ($x = @not_found_words; $x > 0; $x--) {
# \b matches on word boundary	    
	    $match_word = $not_found_words[$x - 1];
	    if ($line =~ /\b$match_word\b/i) {
		splice(@not_found_words,$x - 1, 1);
	    } # End of If
	} # End of For Loop
    } else {
	for ($x = @not_found_words; $x > 0; $x--) {
	    $match_word = $not_found_words[$x - 1];
	    if ($line =~ /$match_word/i) {
		splice(@not_found_words,$x - 1, 1);
	    } # End of If
	} # End of For Loop
    } # End of ELSE

} # End of FindKeywords

############################################################
#
# subroutine: GetNextEntry
#   Usage:
#     &GetNextEntry(DIRECTORY_HANDLE, "directory_name");
#
#   Parameters:
#     DIRECTORY_HANDLE = handle to currently open directory
#     $directory = full path of directory
#
#   Output:
#     $filename = name of next file, null if no more files
#                 in current directory
# 
############################################################

sub GetNextEntry {
    local($dirhandle, $directory) = @_;

    while ($filename = readdir($dirhandle)) {
	if (($filename =~ /htm.?/i) ||
	    (!($filename =~ /^\.\.?$/) &&
	     -d "$directory/$filename")) {
	    last;
	} # End of IF Filename is html document or a directory
    } # End of while still stuff to read

# Filename will be valid if it is a directory or an HTML file.
    $filename;

} # End of GetNextEntry



