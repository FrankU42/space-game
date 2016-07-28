var ExplosionParticleHandler = function() {
  
    var currentExplosions = [];
    
    return {
    	//Erzeugt eine Explosion(position, Lebenszeit, Farbe, Geschwindigkeit, Groeße)
        addExplosion: function(position, lifetime, color,speed, size, implosion) {
            var explosion = new ExplosionParticleRenderer(color, 10000, fileLoader.get("particle_grey"), lifetime+2, position, speed, size, implosion);
            if(size==undefined) {size=1;}
            if(speed==undefined) {speed=5;}
            if(implosion==undefined) {implosion=false;}
            for (var i = 0; i < 15; i++) {
                explosion.update();
            }
            currentExplosions.push(explosion);
        },
        update: function() {
            for (var i = 0; i < currentExplosions.length; i++) {
                var explosion = currentExplosions[i];
                var successful = explosion.update();
                if (!successful) {
                    currentExplosions.splice(i,1);
                }
            }
        }
    };
    
};
