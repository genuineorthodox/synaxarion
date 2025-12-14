#!/usr/bin/env perl

use Modern::Perl;
use YAML::XS ();

our %TYPES = (
	saint => [qw{who intro sticharion}],
	odes  => [qw{ode verses irmos theotokion tune}],
);

our %KEYS; map {
	++$KEYS{$_}
} map @$_, values %TYPES;

FILE:
for my $file (qx{find ./docs -type f -iname '[a-z][a-z].json'}) {
	chomp $file;

	my $entry;
	unless ($entry = eval { YAML::XS::LoadFile($file) }) {
		say "$file: $@";
		next FILE;
	}
	elsif (ref($entry) ne 'ARRAY') {
		say "$file is not a valid array";
		next FILE;
	}
	elsif (not @$entry) {
		say "$file is an empty array";
		next FILE;
	}
	
	for my $e (0..$#{$entry}) {
		if ('HASH' ne ref $entry->[$e]) {
			say "$file:$e is not a valid hash";
		}
		elsif (my @surplus = grep {
			not exists $KEYS{$_}
		} keys %{$entry->[$e]}) {
			say "$file:$e unsupported key(s): @surplus";
		}
	}

	my ($preface, $month, $day, $lang) =
		$file =~ /^(.*)\/(\d+)\/(\d+)\/([a-z]{2})\.json$/g;
	my $hdl = sprintf '%s.json', join '/', $preface, $lang, $month, $day;

	qx{ln $file $hdl} unless -f $hdl;
}



1;
