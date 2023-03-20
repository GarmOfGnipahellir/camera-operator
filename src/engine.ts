import {
  Engine,
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  CreateSphere,
  CreateGround,
} from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export default class {
  private engine: Engine;
  private scene: Scene;

  constructor() {
    const canvas = document.getElementById("main") as HTMLCanvasElement;
    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var material = new GridMaterial("grid", scene);

    var sphere = CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);
    sphere.position.y = 2;
    sphere.material = material;

    var ground = CreateGround(
      "ground1",
      { width: 6, height: 6, subdivisions: 2 },
      scene
    );
    ground.material = material;

    window.addEventListener("resize", () => engine.resize());

    this.engine = engine;
    this.scene = scene;
  }

  runRenderLoop() {
    this.engine.runRenderLoop(this.renderLoop);
  }

  renderLoop() {
    this.scene.render();
  }
}
