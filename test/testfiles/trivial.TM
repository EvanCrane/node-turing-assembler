--Trivial TM: (moves Right, swaps 0 &1)
-- Initialization:
{states: A,AC,R}
{start: A}
{accept: AC}
{reject: R}
{alpha: 0,1}
{tape-alpha: 0,1}
-- Main Algorithm:
-- 0:

rwRt A 0 1 A;
rwRt A 1 0 A;
rwRt A _ _ AC;
