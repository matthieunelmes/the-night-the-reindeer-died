var boot = function(game){
	console.log("%cAwwwww Yissss", "color:white; background:red");
};
  
boot.prototype = {
	preload: function(){
		this.game.load.image('loading', 'assets/preloader-bar.png');
	},
  	create: function(){
		//this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    this.scale.pageAlignVertically = true;
		this.scale.pageAlignHorizontally = true;
		this.scale.setScreenSize();
		this.game.state.start('Preload');
	}
}