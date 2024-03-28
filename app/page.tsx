'use client';

import { fabric } from 'fabric';

import { Button } from '@tremor/react';

import style from './index.module.css';
import { useState, useEffect, useRef } from 'react';
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}
interface IconOptions {
  borderColor: String;
  headPath: String;
  mouthColor: String;
  mouthPath: String;
}
interface AvatarGeneratorProps {
  setCanvas: React.Dispatch<React.SetStateAction<fabric.Canvas | undefined>>;
  option: IconOptions;
}

const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({
  setCanvas,
  option
}) => {
  const { headPath, borderColor, mouthColor, mouthPath } = option;

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', { width: 400, height: 400 });
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));

    const fabricDefaultConfig = {
      selectable: false,
      strokeWidth: 5
    };

    // 创建一个圆形头像
    const circle = new fabric.Path(`${headPath}`, {
      ...fabricDefaultConfig,
      fill: '',
      stroke: `${borderColor}` || 'pink'
    });
    // 创建一个小眼睛
    const eyeLeft = new fabric.Circle({
      ...fabricDefaultConfig,
      radius: 2,
      fill: '',
      stroke: `${borderColor}` || 'pink',
      left: 150,
      top: 100
    });
    const mouth = new fabric.Path(`${mouthPath}`, {
      ...fabricDefaultConfig,
      fill: `${mouthColor}` || 'pink',
      left: 200
    });

    canvas.add(circle);
    canvas.add(eyeLeft);
    canvas.add(mouth);
    setCanvas(canvas);
  }, [option]);

  return <canvas className="rounded overflow-hidden " id="canvas" />;
};
function AvatarGeneratorPage() {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const defaultMouthPath =
    'M 120 100 C 260 60 240 120 160 140 C 260 140 220 180 100 160 C 60 160 40 120 120 100';
  const defaultHeadPath =
    'M 0 300 Q 60 280 140 360 C 160 280 160 240 140 180 C 80 80 160 20 240 40 C 260 40 300 100 280 160 C 260 220 280 300 280 340 Q 340 280 400 280';
  const [option, setOption] = useState<IconOptions>({
    borderColor: '#2d2e17',
    headPath: defaultHeadPath,
    mouthColor: '#ffe561',
    mouthPath: defaultMouthPath
  });
  // --start
  function modifyPathWithRandomness(
    originalPath: string,
    maxRandomOffset: number
  ): string {
    // 将原始路径字符串分割成坐标点数组
    const points = originalPath.split(' ').filter((point) => point !== '');

    // 对路径中的关键点进行微小调整，并添加随机偏移量
    for (let i = 1; i < points.length; i++) {
      if (!isNaN(Number(points[i]))) {
        const randomOffset =
          Math.random() * maxRandomOffset * (Math.random() < 0.5 ? -1 : 1);
        points[i] = String(Number(points[i]) + randomOffset);
      }
    }
    // 重新构建路径字符串
    const modifiedPath = points.join(' ');
    return modifiedPath;
  }

  // --end
  const handlerCreateGoose = () => {
    setOption({
      borderColor: '#2d2e17',
      mouthColor: '#ffe561',
      headPath: modifyPathWithRandomness(defaultHeadPath, 40),
      mouthPath: modifyPathWithRandomness(defaultMouthPath, 10)
    });
  };

  const handlerDownloadImg = () => {
    const dataURL = canvas?.toDataURL({ format: 'png' });
    const link = document.createElement('a');
    link.href = dataURL || '';
    link.download = 'GOOGOOCOO.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="h-full flex flex-col pb-10">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mx-auto flex items-center justify-center mb-4">
          <AvatarGenerator setCanvas={setCanvas} option={option} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4 mb-10">
        <div className="mb-20 flex flex-row space-x-4">
          <Button
            className="mr-10"
            size="lg"
            variant="secondary"
            onClick={() => handlerCreateGoose()}
          >
            GOOGOOCOO
          </Button>
          <Button
            size="lg"
            variant="light"
            onClick={() => handlerDownloadImg()}
          >
            Save
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-gray-200">
            对
            <a href="https://txstc55.github.io/duck-duck-duck/">
              <em>duck-duck-duck</em>
            </a>
            的拙劣模仿
          </p>
          <p className="text-gray-200">
            From&nbsp;
            <a href="https://github.com/">
              <em>@Sodako</em>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default async function IndexPage() {
  return (
    <main
      className="p-4 md:p-10 mx-auto max-w-7xl"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <AvatarGeneratorPage />
    </main>
  );
}
