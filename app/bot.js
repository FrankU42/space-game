// Botklasse
var minObstacleDistance = 100;
var enemy, asteroid, playerPosition, shootAble, worldRadius, radius;

// Sortierfunktion für Bots (Enemies und Asteroids)
// je naeher am Schiff, desto niedriger der Indize
function compare(a,b) {
    // bei freier Bewegung: distanceToSquared(playerPosition)
    var distanceA = a.location.distanceToSquared(playerPosition);
    var distanceB = b.location.distanceToSquared(playerPosition)

    if(distanceA < distanceB) {
        return -1;
    } else if(distanceA > distanceB) {
        return 1;
    } else {
        return 0;
    }
}

// Asteroidenklasse
function Asteroid(location,direction,speed) {
    this.direction = speed * direction.normalize();
    this.location = location;
};

Asteroid.prototype.move = function(delta, asteroids, enemies) {
    this.location += direction;
};

// Enemyklasse
function Enemy(speed,location, weapon) {
    this.speed = speed;
    this.location = location;
    this.weapon = weapon;
    this.isAlive = true;
    this.shootAble = false;
};

Enemy.prototype.move = function(delta, asteroids, enemies) {
    var wrongDir, avoidDir, alpha;
    // prinzipielle Richtung
    var directionToPlayer = new THREE.Vector3();
    directionToPlayer.copy(playerPosition);
    directionToPlayer.sub(this.location);
    directionToPlayer.normalize();

    // ueberpruefe auf Hindernisse
    // fuer Rand von Box um Enemy
    var raycaster = new THREE.Raycaster(this.location,directionToPlayer,0,
        minObstacleDistance);

    var AsteroidCollisions = raycaster.intersectObjects(asteroids,true);
    var ShipCollisions = raycaster.intersectObjects(enemies,true);

    // falls es zu einer Moeglichkeit einer Kollision kommt, aendere Richtung
    asteroid = AsteroidCollisions.length > 0 ? AsteroidCollisions[0] : Infinity;
    enemy   =  ShipCollisions.length > 0 ? ShipCollisions[0] : Infinity;

    if(asteroid!=Infinity || enemy!=Infinity) {
        // nur dem ersten Gegenstand ausweichen
        if(enemy.distanceToSquared(this.position) <
            asteroid.distanceToSquared(this.position)) {
                wrongDir = enemy.direction;
        } else {
                wrongDir = asteroid.direction;
        }

        // Ausweichrichtung:
        // negative Hindernisflugrichtung, bis zu 90° Winkel um ideale Richtung
        // gedreht
        avoidDir = new Vector3(0,0,0);
        avoidDir.sub(wrongDir);
        alpha = Math.PI * Math.random() - Math.PI/2;
        avoidDir.applyAxisAngle(directionToPlayer,alpha);

        avoidDir.normalize();

        // je naeher an Gegenstand desto mehr ausweichen
        avoidImpact = ??
    } else {
        avoidDir = new Vector3(0,0,0);
        avoidImpact = 0;
        shootAble = true;
    }

    direction = directionToPlayer.normalize() + avoidImpact * avoidDir();

    // normalisiere, um Geschwindigkeit nur von speed abhaengig zu machen
    direction.normalize();

    this.location = this.location + this.speed * direction;
};

Enemy.prototype.shoot = function() {
    // Schießt von location mit weapon in direction
};

Enemy.prototype.shot = function() {
    // Für jeden Schuss im Spiel und jeden Gegenstand in der Naehe
    // überprüfe Kollision
    return false;
}


// Kollisionsueberpruefung und getroffene Ausschalten
function checkCollisionAndDestroy() {
    return enemies;
}

// aktualisiere Position der Asteroiden und Gegner
// Setze direction neu
function updateLocation(delta) {
    // 1. Schritt: ideale Richtungen ausrechnen

    // 2. Schritt: Asteroiden und Gegner sortieren
    asteroids.sort(compare);
    enemies.sort(compare);

    // 3. Schritt: Ausweichen
    // Asteroiden haben keine Intelligenz -> Bewegung behalten
    // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
    //                         -> allen vor sie liegenden Gegnern ausweichen
    // -> vordere updaten und Richtung des nächsten anhand der neuen Position
    //    ausrechnen

    // Asteroiden: Bewegung updaten
    for(asteroid of asteroids) {
        asteroid.move(delta, asteroids, enemies)
    }

    // Enemies bewegen

    // erst ab bestimmter Distanz d_max ausweichen priorisieren
    // ab d_min auf jeden Fall ausweichen


    location += direction;
}

// update-Methode, aufzurufen in jedem Durchlauf des Renderers
function update(delta) {
    // Spielerposition updaten
    playerPosition = new THREE.Vector3(0,0,0);
    // Gegner und Asteroiden updaten
    updateLocation(delta);
    // Kollisionsueberpruefung -> zerstoerte Loeschen
    enemies = checkCollisionAndDestroy(asteroids, enemies);
    // Schiessen
    for(enemy of enemies) {
        if(enemy.shootAble==true) {
            enemy.shoot();
        }
    }
}

// Erschaffe Asteroiden
function createAsteroid(level) {
    // Welt als Kugel -> Setze an den aeusseren 1/6 Rand
    radius = worldRadius/6 * (5+Math.random());

    // zufaellig an den Rand positionieren
    do {
        alpha = 2*Math.PI*Math.random();
        beta = Math.PI*Math.random();
        asteroidPosition = new THREE.Vector3(
            Math.sin(beta)*Math.sin(alpha),
            Math.sin(beta)*Math.cos(alpha),
            Math.cos(beta));
        asteroidPosition.multiplyScalar(radius);
    } while(//far away
        );

    // speed abhaengig von Level
    speed = 1;

    // Richtung:
    // Gegengesetzt zur Normalen mit kleinem Fehlerwinkel (bis zu 20°)
    direction = new THREE.Vector3(
            Math.sin(beta)*Math.sin(alpha),
            Math.sin(beta)*Math.cos(alpha),
            Math.cos(beta));
    direction *= Math.pow(-1,Math.round(1000*Math.random())) *
                     Math.random() * 0.36397023;

    asteroid = new Asteroid(asteroidPosition, direction, speed);

    return asteroid;
}

// Erschaffe Enemy
function createEnemy() {

}


// Initialisierer der Bots
function initAI(level) {
    // erstelle Asteroiden
    asteroids = [];

    for(var i = 0; i < 5 * level; i++) {
        asteroid = createAsteroid();
        asteroids.push(asteroid);
    }

    // erstelle Gegner
    enemies = [];

    for(i =0 ; i < 3 * level; i++) {
        enemy = createEnemy();
        enemies.push(enemy);
    }
}
