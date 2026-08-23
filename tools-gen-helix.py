import math

CX, AMP = 24.0, 5.05          # helix centre-x and radius in viewBox units
Y0, Y1  = 10.8, 37.2          # vertical extent
TURNS   = 2.75                # full revolutions across that extent
STEPS   = 180                 # sampling resolution for the strand polylines

def pt(t):
    """Return (x, y, z) on the helix at normalised height t, phase 0 strand.
    x is the projected horizontal position, z is depth (>0 = toward viewer)."""
    ph = 2 * math.pi * TURNS * t
    y = Y0 + (Y1 - Y0) * t
    return CX + AMP * math.sin(ph), y, math.cos(ph)

def strand(offset):
    """Sample one strand; offset is a phase shift in turns (0.5 = antiphase)."""
    out = []
    for i in range(STEPS + 1):
        t = i / STEPS
        ph = 2 * math.pi * (TURNS * t + offset)
        y = Y0 + (Y1 - Y0) * t
        out.append((CX + AMP * math.sin(ph), y, math.cos(ph)))
    return out

def segments_by_depth(points, front):
    """Split a sampled strand into runs that are either in front or behind,
    so the two strands can be interleaved in draw order."""
    runs, cur = [], []
    for x, y, z in points:
        is_front = z >= 0
        if is_front == front:
            cur.append((x, y))
        elif cur:
            runs.append(cur); cur = []
    if cur:
        runs.append(cur)
    return [r for r in runs if len(r) > 1]

def path_d(run):
    d = "M" + f"{run[0][0]:.2f} {run[0][1]:.2f}"
    return d + "".join(f"L{x:.2f} {y:.2f}" for x, y in run[1:])

A, B = strand(0.0), strand(0.5)

# --- Rungs -----------------------------------------------------------------
# Sampled at even phase intervals. Width and opacity track |sin(phase)|, so a
# rung is boldest where the strands are furthest apart and vanishes where they
# cross - which is what gives the ladder its sense of rotation.
rungs, nodes = [], []
RUNGS = 34
for i in range(1, RUNGS):
    t = i / RUNGS
    ph = 2 * math.pi * TURNS * t
    sep = abs(math.sin(ph))
    if sep < 0.26:                     # too close to a crossing to draw cleanly
        continue
    y = Y0 + (Y1 - Y0) * t
    xa = CX + AMP * math.sin(ph)
    xb = CX - AMP * math.sin(ph)
    op = 0.26 + 0.50 * sep
    w  = 0.55 + 0.45 * sep
    rungs.append((xa, xb, y, op, w))
    # Base-pair nodes sit on the strand that is currently nearest the viewer.
    za = math.cos(ph)
    nodes.append((xa, y, 0.34 + 0.20 * sep, 0.92 if za >= 0 else 0.42))
    nodes.append((xb, y, 0.34 + 0.20 * sep, 0.92 if za < 0 else 0.42))

def emit(indent="      "):
    L = []
    ap = L.append
    i = indent

    ap(f'{i}<!-- Double helix. Strands are depth-sorted: the receding halves are')
    ap(f'{i}     drawn first and dimmed, the rungs next, then the advancing')
    ap(f'{i}     halves on top, so the two backbones visibly cross. -->')

    # Back halves of both strands.
    ap(f'{i}<g stroke="#BFD9F5" stroke-width="1.15" stroke-linecap="round" fill="none" opacity=".5">')
    for run in segments_by_depth(A, False) + segments_by_depth(B, False):
        ap(f'{i}  <path d="{path_d(run)}"/>')
    ap(f'{i}</g>')

    # Rungs.
    ap(f'{i}<g stroke="#DFFCE7" stroke-linecap="round">')
    for xa, xb, y, op, w in rungs:
        ap(f'{i}  <path d="M{xa:.2f} {y:.2f}L{xb:.2f} {y:.2f}" '
           f'stroke-width="{w:.2f}" opacity="{op:.2f}"/>')
    ap(f'{i}</g>')

    # Front halves.
    ap(f'{i}<g stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" fill="none">')
    for run in segments_by_depth(A, True) + segments_by_depth(B, True):
        ap(f'{i}  <path d="{path_d(run)}"/>')
    ap(f'{i}</g>')

    # Base-pair nodes.
    ap(f'{i}<g fill="#FFFFFF">')
    for x, y, r, op in nodes:
        ap(f'{i}  <circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}" opacity="{op:.2f}"/>')
    ap(f'{i}</g>')
    return "\n".join(L)

if __name__ == "__main__":
    print(emit())
