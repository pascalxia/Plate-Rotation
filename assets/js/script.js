$(document).ready(function(){

    // Initialize Global Variables
	var currCursorY = 0;
    var alpha = 0;
	var objXPosArray = [96, 115, 127, 113, 126, 103];
    var objYPosArray = [307, 318, 335, 355, 395, 420];
	var randIndexDict = {};
	var savedAlpha = [];
    //var objXPos = 96;
    //var objYPos = 307;
	
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
	context.ellipse = makeEllipse
	
	//choose next plate position randomly
    var randIndex = Math.floor(Math.random() * 6);
    while (randIndexDict[randIndex]) {
        randIndex = Math.floor(Math.random() * 6);
    }
	//mark the position as chosen
    randIndexDict[randIndex] = true;
	//update plate position
    objXPos = objXPosArray[randIndex];
    objYPos = objYPosArray[randIndex];
	//clear canvas and draw the new plate according to mouse
    makePlate();

    // Respond to Cursor Movement
    $(document).mousemove(function(event){
        currCursorY = event.pageY;
        document.getElementById("curr-cursorY").value = currCursorY;
        makePlate();        
    });

    // Save Alpha Upon Click, and Move Plate
    $(document).click(function() {
		//save alpha
        savedAlpha.push(alpha);
        document.getElementById("saved-alpha").value = savedAlpha;
		//When finished, repeat from the beginning
		if (savedAlpha.length == 6) {
            savedAlpha = [];
            randIndexDict = {};
        }
		//choose next plate position randomly
        var randIndex = Math.floor(Math.random() * 6);
        while (randIndexDict[randIndex]) {
            randIndex = Math.floor(Math.random() * 6);
        }
		//mark the position as chosen
        randIndexDict[randIndex] = true;
		//update plate position
        objXPos = objXPosArray[randIndex];
        objYPos = objYPosArray[randIndex];
		//clear canvas and draw the new plate according to mouse
        makePlate();
    });

    function makePlate() {
        // Clear canvas and redraw plate and bar according to mouse
		//clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
		//get alpha according to mouse
		var sensitivity = 180/canvas.height;
		var centerY = canvas.height/2 + 42;//42 is the y coordinate of the top border of the canvas.
		alpha = -sensitivity*(currCursorY-centerY);
		  //the above line assures that when the cursor is at centre, alpha = 0; and when cursor is moved to the top border of the canvas, alpha = 90.
		alpha = Math.min(Math.max(alpha,0), 90);
		alpha = alpha/180*Math.PI;
		//draw plate
        var plateWidth = 30		
        var ellipseHeight = plateWidth * Math.cos(alpha);
        context.beginPath();
        context.ellipse(objXPos, objYPos, plateWidth, ellipseHeight, 0);
        context.lineWidth = 2;
        context.strokeStyle = 'red';
        context.stroke();
        context.closePath();
        //draw bar
        var barHeight = Math.max((plateWidth/2) * Math.sin(alpha), 3);
        context.rect(objXPos, objYPos - (barHeight), 1, barHeight);
        context.strokeStyle = 'red';
        context.stroke();
    }

    function makeEllipse(xCoordinate, yCoordinate, width, height, rotation) { // Rotation in Radians
        var xDraw, yDraw, horizontalRadius, verticalRadius, angleIncrement;
        angleIncrement = 0.01
        horizontalRadius = width/2;
        verticalRadius = height/2;
        xDraw = xCoordinate + horizontalRadius * Math.cos(rotation);
        yDraw = yCoordinate + horizontalRadius * Math.sin(rotation);
        this.moveTo(xDraw, yDraw); // Starting Position
        for (var angle = angleIncrement; angle < 2 * Math.PI; angle += angleIncrement) { // Increment Angle (0 to 2 Pi)
            xDraw = xCoordinate + horizontalRadius * Math.cos(angle) * Math.cos(rotation) - verticalRadius * Math.sin(angle) * Math.sin(rotation);
            yDraw = yCoordinate + horizontalRadius * Math.cos(angle) * Math.sin(rotation) + verticalRadius * Math.sin(angle) * Math.cos(rotation);
            this.lineTo(xDraw, yDraw); // Draw Curved Line to Create Ellipse
        }
    }

});