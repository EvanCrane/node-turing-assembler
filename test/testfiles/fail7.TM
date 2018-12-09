--   transition leaves Accept state or Reject state (I believe he said this is invalid?)
{states: A, q0, R}
{start: q0}
{accept: A}
{reject: R}
{alpha: c, d}
{tape-alpha: c, d}

-- this is fine
rRt q0 c A

-- this is a problem
rRt A c q0

-- this is a problem
rRt R c q0
