# The Great Wall Of JS

The Great Wall Of JS: a multi-purpose button/image grid library using flexbox and flex wrap.

# Features:

Supports Filtering (SavvySearch/Masis), Resizeable Grids, and Button support inlucing multi-select (ctrl-click.)

# Usage

# num of items per row (using media query for small screens / devices):

use css (or classname in JSON config file) .item width 25% (1/4) or (1/n) to adjust the number of items per row...

color-sequence: in-order | Random
font-sequence-inner: in-order | Random
font-sequence-outer: in-order | Random
size-sequence: in-order | Random / gaps (invisible buttons of a certain size added, with hidden propery and unlickable, add to number added when reated if applicable 
for(+gapNumber)

text-order:
rand | sequential

border-color-order:
rand | sequential

img-order:
rand | sequential


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


support property inheritance (proprties can be manually overriden as well when inherited...)


Change the Padding (size around) the button:

.buttonBrick > div {
	padding: 10px;
}
