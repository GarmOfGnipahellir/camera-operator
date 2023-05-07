import { Circle, Pt, Triangle } from "pts";

export class Vert {
  edges: number[] = [];

  constructor(public pt: Pt) {}
}

export class Edge {
  constructor(public from: number, public to: number) {}
}

export class Face {
  constructor(public edges: [number, number, number]) {}
}

export class Graph {
  verts: Vert[] = [];
  edges: Edge[] = [];
  faces: Face[] = [];

  orphanVerts: number[] = [];

  addVert(pt: Pt): number {
    let v = new Vert(pt);
    let vId = this.verts.push(v) - 1;
    this.orphanVerts.push(vId);
    return vId;
  }

  addEdge(from: number, to: number): number {
    let vFrom = this.verts[from];
    let vTo = this.verts[to];
    let e = new Edge(from, to);
    let eId = this.edges.push(e) - 1;
    vFrom.edges.push(eId);
    vTo.edges.push(eId);
    return eId;
  }

  addFace(verts: [number, number, number]): number {
    let es: [number, number, number] = [-1, -1, -1];
    for (let i = 0; i < 3; i++) {
      let j = (i + 1) % 3;

      let eId = this.addEdge(verts[i], verts[j]);
      es[i] = eId;
    }
    return this.faces.push(new Face(es)) - 1;
  }

  getFaceVertIds(i: number): [number, number, number] {
    const face = this.faces[i];
    return [
      this.edges[face.edges[0]].from,
      this.edges[face.edges[1]].from,
      this.edges[face.edges[2]].from,
    ];
  }

  getFacePts(i: number): [Pt, Pt, Pt] {
    const face = this.faces[i];
    return [
      this.verts[this.edges[face.edges[0]].from].pt,
      this.verts[this.edges[face.edges[1]].from].pt,
      this.verts[this.edges[face.edges[2]].from].pt,
    ];
  }

  calcEdgeMidPt(i: number): Pt {
    const edge = this.edges[i];
    const ptFrom = this.verts[edge.from].pt;
    const ptTo = this.verts[edge.to].pt;
    return new Pt((ptFrom.x + ptTo.x) / 2, (ptFrom.y + ptTo.y) / 2);
  }

  isDelaunay(verts: [number, number, number]): boolean {
    const pts = verts.map((i) => this.verts[i].pt);
    const cc = Triangle.circumcenter(pts);
    const crsq = pts[0].$subtract(cc).magnitudeSq();

    for (let i = 0; i < this.verts.length; i++) {
      if (verts.includes(i)) continue;

      const pt = this.verts[i].pt;
      if (pt.$subtract(cc).magnitudeSq() < crsq) {
        return false;
      }
    }
    return true;
  }

  updateGraph() {
    if (this.verts.length < 3) return;

    for (const i of this.orphanVerts) {
      let faceAdded = false;

      for (let j = 0; j < this.verts.length; j++) {
        if (j == i) continue;
        for (let k = 0; k < this.verts.length; k++) {
          if (k == j || k == i) continue;

          if (this.isDelaunay([i, j, k])) {
            this.addFace([i, j, k]);
            faceAdded = true;
            break;
          }
        }
        if (faceAdded) break;
      }

      if (this.verts.length == 3) break;
    }

    this.orphanVerts = [];
  }
}
