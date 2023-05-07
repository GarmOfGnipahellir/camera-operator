import { CanvasSpace, Circle, Group, Line, Polygon, Pt } from "pts";
import { Graph } from "./model";

export const space = new CanvasSpace("#main");
space.setup({ bgcolor: "#111", resize: true });
export const form = space.getForm();
export let canvasRadius: number;
export let canvasHalfMin: number;

let mousePt = new Pt();
let graph = new Graph();

space.add({
  animate: () => {
    canvasRadius = space.center.magnitude();
    canvasHalfMin = Math.min(space.center.x, space.center.y);

    let pts = graph.verts.map((vert) => vert.pt);
    let lines = graph.edges.map(
      (edge) => new Group(pts[edge.from], pts[edge.to])
    );
    let polys = graph.faces.map((face) => {
      let v1 = pts[graph.edges[face.edges[0]].from];
      let v2 = pts[graph.edges[face.edges[1]].from];
      let v3 = pts[graph.edges[face.edges[2]].from];
      return new Group(v1, v2, v3);
    });

    form.fillOnly("#ff2222").polygons(polys);
    form.strokeOnly("#fff").lines(lines);
    form.fillOnly("#fff").points(new Group(...pts), 4.0, "circle");

    for (const poly of polys) {
      if (Polygon.hasIntersectPoint(poly, mousePt)) {
        form.strokeOnly("#fff").circle(Circle.fromTriangle(poly, true));
      }
    }
  },
  action: (type, px, py, evt) => {
    mousePt = new Pt(px, py);

    if (type == "click") {
      graph.addVert(new Pt(px, py));
      graph.updateGraph();
    }
  },
});

space.bindMouse().play();
