class Obstacle{

    constructor(refImage, x,y) {
        this.refImage = refImage;
        this.x = x;
        this.y = y;
        this.inicialX = x;
        this.inicialY = x;
        this.velocity = random(0,1);
        this.dir = random(6);

    }

    paint() {
        imageMode(CENTER);
        image(this.refImage, this.x, this.y);
    }

    move(){
        if (this.dir > 3) {
            this.x = this.x + this.velocity;
        } else {
           this.x = this.x - this.velocity;
        }
        if (this.x < 0) {
           this.dir = 4;
        }

        if (this.x > 600) {
            this.dir = 2;
        }
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }
}