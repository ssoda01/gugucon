'use client';

import { fabric } from 'fabric';

import {
  Button,
  Card,
  Metric,
  Text,
  Title,
  BarList,
  Flex,
  Grid
} from '@tremor/react';

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
  const { borderColor, mouthColor, mouthPath } = option;

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', { width: 400, height: 400 });
    canvas.setBackgroundColor('white', canvas.renderAll.bind(canvas));

    // 创建一个圆形头像
    const circle = new fabric.Path(
      'M 0 300 Q 60 280 140 360 C 160 280 160 240 140 180 C 80 80 160 20 240 40 C 260 40 300 100 280 160 C 260 220 280 300 280 340 Q 340 280 400 280',
      {
        fill: '',
        strokeWidth: 5,
        stroke: `${borderColor}` || 'pink'
      }
    );
    // 创建一个小眼睛
    const eyeLeft = new fabric.Circle({
      radius: 2,
      fill: '',
      strokeWidth: 5,
      stroke: `${borderColor}` || 'pink',
      left: 150,
      top: 100
    });
    const mouth = new fabric.Path(`${mouthPath}`, {
      strokeWidth: 5,
      fill: `${mouthColor}` || 'pink',
      left: 200
      // height: 10
    });

    canvas.add(circle);
    canvas.add(eyeLeft);
    canvas.add(mouth);
    setCanvas(canvas);
  }, [option]);

  return (
      <canvas id="canvas" width={400} height={400} />
  );
};

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const getMouthPath = () => {
    let path: string =
      'M 120 100 C 260 60 240 120 160 140 C 260 140 220 180 100 160 C 60 160 40 120 120 100 ';
    let pathParts = path.split(' ');
    // 修改第一个贝塞尔曲线的第一个控制点
    // pathParts[1] = '270';
    pathParts[5] = '270';
    pathParts[6] = '70';
    return pathParts.join(' ');
  };
  const [option, setOption] = useState<IconOptions>({
    borderColor: '#2d2e17',
    mouthColor: '#ffe561',
    mouthPath:
      'M 120 100 C 260 60 240 120 160 140 C 260 140 220 180 100 160 C 60 160 40 120 120 100 '
  });
  const handlerCreateGoose = () => {
    setOption({
      borderColor: '#2d2e17',
      mouthColor: '#ffe561',
      mouthPath: getMouthPath()
    });
    console.log('new Option', option);
  };

  const handlerDownloadImg = () => {
    console.log('variant');
    const dataURL = canvas?.toDataURL({ format: 'png' });
    const link = document.createElement('a');
    link.href = dataURL || '';
    link.download = 'canvas.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Grid numItemsSm={1} numItemsLg={2} className="gap-6">
        <Card
          className={style.squareCanvas}
        >
          <AvatarGenerator setCanvas={setCanvas} option={option} />
        </Card>
        <Card
          decoration="bottom"
        >
          <div className="mx-auto grid grid-cols-1 gap-12">
            <div className="space-y-3">
              <Text>
                仿照
                <a
                  href="https://txstc55.github.io/duck-duck-duck/"
                  target="__blank"
                >
                  <strong>duck-duck-duck</strong>
                </a>
                但是低配版
              </Text>
            </div>
            <div>
              <Button className="mr-4 p-4" onClick={() => handlerCreateGoose()}>
                Got my goose
              </Button>
              <Button
                className="p-4"
                variant="secondary"
                onClick={() => handlerDownloadImg()}
              >
                Save Image
              </Button>
            </div>
          </div>
        </Card>
      </Grid>
    </main>
  );
}
