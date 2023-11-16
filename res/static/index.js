function Canvas() {
    this.width = 0;
    this.height = 0;

    this.elem = document.querySelector('canvas');
    this.ctx = this.elem.getContext('2d');

    addEventListener('resize', () => this.resize());
    this.resize();
}

Canvas.prototype.render = function () {
    
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 10;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(100, 200);
    this.ctx.stroke();
}

Canvas.prototype.resize = function () {
    this.width = this.elem.width = document.body.offsetWidth;
    this.height = this.elem.height = document.body.offsetHeight;
    this.render();
}

let canvas = new Canvas();