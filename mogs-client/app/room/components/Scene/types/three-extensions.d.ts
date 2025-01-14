declare module "three/examples/jsm/loaders/FBXLoader" {
    import { Group, Loader } from "three";

    export class FBXLoader extends Loader {
        constructor();
        load(
            url: string,
            onLoad: (object: Group) => void,
            onProgress?: (event: ProgressEvent) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
        parse(data: ArrayBuffer | string, path: string): Group;
    }
}
