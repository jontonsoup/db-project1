#!/usr/bin/perl -w

@ora = `ps auxww | grep oracle`;
@rwb = `ps auxww | grep perl | grep rwb | grep -v grep`;


map { ($user,$pid,$cpu,$mem) = split(/\s+/,$_); $ora_cpu+=$cpu; $ora_mem+=$mem; } @ora;


map { ($user,$pid,$cpu,$mem) = split(/\s+/,$_); $rwb_cpu+=$cpu; $rwb_mem+=$mem; } @rwb;


print "There are ".($#ora+1)." Oracle processes active using\n\t$ora_cpu % of the cpu (2400% total)\n\t$ora_mem % of the memory (100% total)\n\n";
print "There are ".($#rwb+1)." rwb.pl processes active using\n\t$rwb_cpu % of the cpu (2400% total)\n\t$rwb_mem % of the memory (100% total)\n\nThe rwb processes have the following distributions\n";

map { 
  ($user,$pid,$cpu,$mem,$j,$j,$j,$j,$j,$rt) = split(/\s+/,$_); 
  $rwb_user{$user}{count}++; 
  $rwb_user{$user}{cpu}+=$cpu; 
  $rwb_user{$user}{mem}+=$mem; 
  $rt =~ /(\d+)\:(\d+)/; 
  $rwb_user{$user}{rt} += $1*60 + $2;
} @rwb;

print "\nUsers by number of rwb.pl processes:\n";
@rwb_ranked = sort { $rwb_user{$b}{count} <=> $rwb_user{$a}{count} } keys %rwb_user;
map { print $_, " (", $rwb_user{$_}{count}, " processes)\n"} @rwb_ranked;
	

print "\nUsers by CPU utilization of rwb.pl processes:\n";
@rwb_ranked = sort { $rwb_user{$b}{cpu} <=> $rwb_user{$a}{cpu} } keys %rwb_user;
map { print $_, " (", $rwb_user{$_}{cpu}, " %)\n"} @rwb_ranked;

print "\nUsers by CPU time in active rwb.pl processes:\n";
@rwb_ranked = sort { $rwb_user{$b}{rt} <=> $rwb_user{$a}{rt} } keys %rwb_user
;
map { print $_, " (", $rwb_user{$_}{rt}, " seconds)\n"} @rwb_ranked;


print "\nUsers by memory utilization of rwb processes:\n";
@rwb_ranked = sort { $rwb_user{$b}{mem} <=> $rwb_user{$a}{mem} } keys %rwb_user;
map { print $_, " (", $rwb_user{$_}{mem}, " %)\n"} @rwb_ranked;

