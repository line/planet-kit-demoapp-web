import { Util } from '@line/planet-kit';

const planetKitUtil = new Util();

export function getBrowserInfo() {
    return planetKitUtil.getBrowserInfo();
}

export function setVideoMirror(mirror, videoElements) {
    planetKitUtil.setVideoMirror(mirror, videoElements);
}

export default planetKitUtil;
