The Great Wall Of JS: Build like the Great wall of china, a multi-purpose grid library using flexbox.


(has video and audio recorder / exporter)

Supports Filtering (SavvySearch/Masis), Resizeable Grids, and Button support inlucing multi-select (ctrl-click.)

Features:

# num of items per row (using media query for small screens / devices):

use css (or classname in JSON config file) .item width 25% (1/4) or (1/n) to adjust the number of items per row...

color-sequence: in-order | Random
font-sequence-inner: in-order | Random
font-sequence-outer: in-order | Random
size-sequence: in-order | Random / gaps (invisible buttons of a certain size added, with hidden propery and unlickable, add to number added when reated if applicable 
for(+gapNumber)

if(item is gap)
{
	//custom gap logic here.
}
)

# Change margins (spacing) between buttosn via the className property passed in as a JSON param: 

i.e. 

.buttonBrick{
	margin: 2.2em 2.2em 2.2em 2.2em;
}