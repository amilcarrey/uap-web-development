import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'react-native';
// Array de memes locales
const memes = [
  require('../assets/1.png'),
  require('../assets/2.png'),
  require('../assets/3.png'),
  require('../assets/4.png'),
];
import { Accelerometer } from 'expo-sensors';

const { width, height } = Dimensions.get('window');
const BALL_SIZE = 40;
const LABYRINTH_WIDTH = width - 40;
const LABYRINTH_HEIGHT = height * 0.6;

function getSafeStart(
  obstacles: {x:number,y:number,w:number,h:number}[],
  goal: {x:number,y:number,r:number}
): {x:number,y:number} {
  // Candidatos: centro y esquinas
  let candidates = [
    { x: LABYRINTH_WIDTH / 2 - BALL_SIZE / 2, y: LABYRINTH_HEIGHT / 2 - BALL_SIZE / 2 },
    { x: 10, y: 10 },
    { x: LABYRINTH_WIDTH - BALL_SIZE - 10, y: LABYRINTH_HEIGHT - BALL_SIZE - 10 },
    { x: 10, y: LABYRINTH_HEIGHT - BALL_SIZE - 10 },
    { x: LABYRINTH_WIDTH - BALL_SIZE - 10, y: 10 }
  ];
  for (let start of candidates) {
    const collidesObstacle = obstacles.some(obs =>
      start.x + BALL_SIZE > obs.x && start.x < obs.x + obs.w &&
      start.y + BALL_SIZE > obs.y && start.y < obs.y + obs.h
    );
    // Colisión con meta
    const dx = start.x + BALL_SIZE / 2 - (goal.x + goal.r);
    const dy = start.y + BALL_SIZE / 2 - (goal.y + goal.r);
    const collidesGoal = Math.sqrt(dx * dx + dy * dy) < goal.r + BALL_SIZE / 2;
    if (!collidesObstacle && !collidesGoal) {
      return start;
    }
  }
  // Si todas las posiciones están ocupadas, devuelve centro
  return { x: LABYRINTH_WIDTH / 2 - BALL_SIZE / 2, y: LABYRINTH_HEIGHT / 2 - BALL_SIZE / 2 };
}

const LabyrinthGame = () => {
  const [level, setLevel] = useState(0);
  const levels = [
    {
      obstacles: [
        { x: LABYRINTH_WIDTH * 0.3, y: LABYRINTH_HEIGHT * 0.2, w: 80, h: 20 },
        { x: LABYRINTH_WIDTH * 0.6, y: LABYRINTH_HEIGHT * 0.5, w: 20, h: 100 },
        { x: LABYRINTH_WIDTH * 0.1, y: LABYRINTH_HEIGHT * 0.7, w: 120, h: 20 },
      ],
      goal: { x: LABYRINTH_WIDTH - BALL_SIZE - 10, y: LABYRINTH_HEIGHT - BALL_SIZE - 10, r: BALL_SIZE / 2 },
    },
    {
      obstacles: [
        { x: LABYRINTH_WIDTH * 0.5, y: LABYRINTH_HEIGHT * 0.1, w: 120, h: 20 },
        { x: LABYRINTH_WIDTH * 0.2, y: LABYRINTH_HEIGHT * 0.4, w: 20, h: 120 },
        { x: LABYRINTH_WIDTH * 0.7, y: LABYRINTH_HEIGHT * 0.6, w: 80, h: 20 },
        { x: LABYRINTH_WIDTH * 0.3, y: LABYRINTH_HEIGHT * 0.3, w: 60, h: 20 },
        { x: LABYRINTH_WIDTH * 0.6, y: LABYRINTH_HEIGHT * 0.8, w: 80, h: 20 },
      ],
      goal: { x: 10, y: LABYRINTH_HEIGHT - BALL_SIZE - 10, r: BALL_SIZE / 2 },
    },
    {
      obstacles: [
        { x: LABYRINTH_WIDTH * 0.2, y: LABYRINTH_HEIGHT * 0.2, w: 20, h: 120 },
        { x: LABYRINTH_WIDTH * 0.6, y: LABYRINTH_HEIGHT * 0.3, w: 100, h: 20 },
        { x: LABYRINTH_WIDTH * 0.4, y: LABYRINTH_HEIGHT * 0.7, w: 120, h: 20 },
        { x: LABYRINTH_WIDTH * 0.1, y: LABYRINTH_HEIGHT * 0.5, w: 80, h: 20 },
        { x: LABYRINTH_WIDTH * 0.7, y: LABYRINTH_HEIGHT * 0.2, w: 20, h: 100 },
        { x: LABYRINTH_WIDTH * 0.5, y: LABYRINTH_HEIGHT * 0.8, w: 60, h: 20 },
      ],
      goal: { x: LABYRINTH_WIDTH - BALL_SIZE - 10, y: 10, r: BALL_SIZE / 2 },
    },
    {
      obstacles: [
        { x: LABYRINTH_WIDTH * 0.1, y: LABYRINTH_HEIGHT * 0.1, w: 60, h: 20 },
        { x: LABYRINTH_WIDTH * 0.2, y: LABYRINTH_HEIGHT * 0.3, w: 20, h: 120 },
        { x: LABYRINTH_WIDTH * 0.4, y: LABYRINTH_HEIGHT * 0.5, w: 100, h: 20 },
        { x: LABYRINTH_WIDTH * 0.6, y: LABYRINTH_HEIGHT * 0.7, w: 80, h: 20 },
        { x: LABYRINTH_WIDTH * 0.8, y: LABYRINTH_HEIGHT * 0.2, w: 20, h: 100 },
        { x: LABYRINTH_WIDTH * 0.3, y: LABYRINTH_HEIGHT * 0.8, w: 60, h: 20 },
        { x: LABYRINTH_WIDTH * 0.5, y: LABYRINTH_HEIGHT * 0.1, w: 80, h: 20 },
      ],
      goal: { x: 10, y: 10, r: BALL_SIZE / 2 },
    },
  ];
  const obstacles = levels[level].obstacles;
  const goal = levels[level].goal;

  const [position, setPosition] = useState(getSafeStart(obstacles, goal));
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [win, setWin] = useState(false);
  const [active, setActive] = useState(true);

  function collides(x: number, y: number) {
    return obstacles.some(obs => x + BALL_SIZE > obs.x && x < obs.x + obs.w && y + BALL_SIZE > obs.y && y < obs.y + obs.h);
  }

  function reachedGoal(x: number, y: number) {
    const dx = x + BALL_SIZE / 2 - (goal.x + goal.r);
    const dy = y + BALL_SIZE / 2 - (goal.y + goal.r);
    return Math.sqrt(dx * dx + dy * dy) < goal.r;
  }

  useEffect(() => {
    Accelerometer.setUpdateInterval(50);
    let subscription: any;
    if (active) {
      subscription = Accelerometer.addListener(accel => {
        setData(accel);
        setPosition(pos => {
          let newX = pos.x + accel.x * 12;
          let newY = pos.y + accel.y * -12;
          newX = Math.max(0, Math.min(LABYRINTH_WIDTH - BALL_SIZE, newX));
          newY = Math.max(0, Math.min(LABYRINTH_HEIGHT - BALL_SIZE, newY));
          if (collides(newX, newY)) {
            if (collides(newX, pos.y)) newX = pos.x;
            if (collides(pos.x, newY)) newY = pos.y;
            if (collides(newX, newY)) return pos;
          }
          if (reachedGoal(newX, newY)) {
            setWin(true);
            setActive(false);
            setTimeout(() => {
              setWin(false);
              setLevel(lvl => {
                const next = (lvl + 1) % levels.length;
                setPosition(getSafeStart(levels[next].obstacles, levels[next].goal));
                return next;
              });
              setActive(true);
            }, 1200);
          }
          return { x: newX, y: newY };
        });
      });
    }
    return () => subscription && subscription.remove();
  }, [active, level]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laberinto - Nivel {level + 1}</Text>
      <View style={styles.labyrinth}>
        {obstacles.map((obs, i) => (
          <View key={i} style={[styles.obstacle, { left: obs.x, top: obs.y, width: obs.w, height: obs.h }]} />
        ))}
        <View style={[styles.goal, { left: goal.x, top: goal.y, width: goal.r * 2, height: goal.r * 2 }]} />
        <View style={[styles.ball, { left: position.x, top: position.y }]} />
      </View>
      {win && (
        <View style={styles.winOverlay}>
          <View style={styles.winContainer}>
            <Text style={styles.winText}>¡Ganaste!</Text>
            <Image
              source={memes[level % memes.length]}
              style={styles.memeImg}
              resizeMode="contain"
            />
          </View>
        </View>
      )}
      <View style={styles.sensorData}>
        <Text>Accelerometer:</Text>
        <Text>X: {data.x.toFixed(2)} Y: {data.y.toFixed(2)} Z: {data.z.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffe4f1', // fondo rosado suave
  },
  winOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  winContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  memeImg: {
    width: 180,
    height: 180,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f06292',
    backgroundColor: '#fff0fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d81b60', // rosa fuerte
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  labyrinth: {
    width: LABYRINTH_WIDTH,
    height: LABYRINTH_HEIGHT,
    borderWidth: 8,
    borderColor: '#f06292', // borde rosa
    borderRadius: 28,
    backgroundColor: '#fff0fa', // fondo laberinto rosado muy claro
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#d81b60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: '#f8bbd0', // rosa pastel
    borderWidth: 3,
    borderColor: '#d81b60', // borde rosa fuerte
    zIndex: 2,
    shadowColor: '#d81b60',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  obstacle: {
    position: 'absolute',
    backgroundColor: '#fce4ec', // rosa muy claro
    borderColor: '#f06292', // borde rosa
    borderWidth: 2,
    borderRadius: 12,
    zIndex: 1,
    shadowColor: '#d81b60',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  goal: {
    position: 'absolute',
    backgroundColor: 'green', // rosa meta
    borderColor: 'green', // borde verde
    borderWidth: 3,
    borderRadius: BALL_SIZE,
    zIndex: 1,
    shadowColor: '#ad1457',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  winText: {
    fontSize: 28,
    color: '#d81b60',
    fontWeight: 'bold',
    marginTop: 16,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sensorData: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#fce4ec',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f06292',
  },
});

export default LabyrinthGame;
