-- Initialization:
{states: Q0,Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8,Q9,Q10,Q11,Q12,A,R} 
{start: Q0}
{accept: A}
{reject: R}
{alpha: 0,1,#}
{tape-alpha: 0,1,#,x}

-- Main Algorithm: 
-- 0:
rwRt Q0 0 x Q1;     -- Read, Write, Right, Transition.
rRl Q1 0;           -- Read, Right, Loop.
rRl Q1 1; 
rRt Q1 # Q3;        -- Read, Right, transition.
rRl Q3 x; 
rwLt Q3 0 x Q5;     -- Read, Write, Left, Transition.

-- 1:
rwRt Q0 1 x Q2;
rRl Q2 0;           -- Read, Right, Loop.
rRl Q2 1;
rRt Q2 # Q4;        -- Read, Right, transition.
rRl Q4 x;
rwLt Q4 1 x Q5;     -- Read, Write, Left, Transition.

-- Find #: 
rLl Q5 x;           -- Read, Left, Loop.
rLt Q5 # Q6;        -- Read, Left, Transition

-- Reset: 
rLl Q6 0; 
rLl Q6 1; 
rRt Q6 x Q0;

Enter infinite spaceland: 
rRt Q0 # Q7; 
rRl Q7 x; 
rRt Q7 _ Q8;
rRt Q8 _ Q9;
rRt Q9 _ Q10;
rRt Q11 _ Q12;
rLt Q12 _ Q11;
rLt Q11 _ Q10;
rLt Q10 _ Q9;
rLt Q9 _ Q8;
rLt Q8 _ Q7;
