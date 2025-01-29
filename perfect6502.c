/*
 Copyright (c) 2010,2014 Michael Steil, Brian Silverman, Barry Silverman

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

#include "types.h"
#include "netlist_sim.h"
/* nodes & transistors */
#include "netlist_6502.h"

void* state = (void*)0;

/************************************************************
 *
 * 6502-specific Interfacing
 *
 ************************************************************/

uint16_t
readAddressBus(void)
{
	return readNodes(state, 16, (nodenum_t[]){ ab0, ab1, ab2, ab3, ab4, ab5, ab6, ab7, ab8, ab9, ab10, ab11, ab12, ab13, ab14, ab15 });
}

uint8_t
readDataBus(void)
{
	return readNodes(state, 8, (nodenum_t[]){ db0, db1, db2, db3, db4, db5, db6, db7 });
}

void
writeDataBus(uint8_t d)
{
	writeNodes(state, 8, (nodenum_t[]){ db0, db1, db2, db3, db4, db5, db6, db7 }, d);
}

uint8_t
readNode(int n)
{
    return isNodeHigh(state, n);
}

void writeNode(int n, int value) {
    writeNodes(state, 1, (nodenum_t[]){n}, value?1:0);
}

uint8_t
readNode8(int n0, int n1, int n2, int n3, int n4, int n5, int n6, int n7)
{
    return readNodes(state, 8, (nodenum_t[]){ n0,n1,n2,n3,n4,n5,n6,n7 });
}

/************************************************************
 *
 * Main Clock Loop
 *
 ************************************************************/

unsigned int cycle;

void
step(void)
{
	BOOL clk = isNodeHigh(state, clk0);
    BOOL read = isNodeHigh(state, rw);

	/* invert clock */
	setNode(state, clk0, !clk);
	recalcNodeList(state);
	cycle++;
}

void
initAndResetChip(void)
{
	/* set up data structures for efficient emulation */
	nodenum_t nodes = sizeof(netlist_6502_node_is_pullup)/sizeof(*netlist_6502_node_is_pullup);
	nodenum_t transistors = sizeof(netlist_6502_transdefs)/sizeof(*netlist_6502_transdefs);
	state = setupNodesAndTransistors(netlist_6502_transdefs,
										   netlist_6502_node_is_pullup,
										   nodes,
										   transistors,
										   vss,
										   vcc);

	setNode(state, res, 1);
	setNode(state, clk0, 1);
	setNode(state, rdy, 1);
	setNode(state, so, 0);
	setNode(state, irq, 1);
	setNode(state, nmi, 1);

	stabilizeChip(state);
	cycle = 0;
}
