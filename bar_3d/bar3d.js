function bar3d() {
    var config = {
      x: prop('x'),
      y: prop('y'),
      z: prop('z'),
      width: prop('width'),
      height: prop('height'),
      depth: prop('depth'),
      camera: [0, 0, 1]
    };
  
    function bar3d(g) {
      g.each(function(d){
        var g = d3.select(this);
        var faces = getFaces.apply(this, arguments);
  
        _.each(faces, function(points, name) {
          var path = g.selectAll('.face.'+name).data([name]);
          path.exit().remove();
          path.enter().append('path')
            .attr('class', 'face ' + name);
  
          d3.transition(path)
            .attr('d', svgHelp.polygon(points));
        });
      });
    }
  
    function getFaces() {
      // resolve absolute positions
      // x,y,z is left top front corner of the bar
      var left = config.x.apply(this, arguments);
      var right = left + config.width.apply(this, arguments);
      var top = config.y.apply(this, arguments);
      var bottom = top + config.height.apply(this, arguments);
      var front = config.z.apply(this, arguments);
      var back = front + config.depth.apply(this, arguments);
  
      var cx = config.camera[0];
      var cy = config.camera[1];
      var cz = config.camera[2];
  
      var projection = perspective(config.camera);
  
      var faces = {};

      if (front > cz) {
        faces.front = projection([
          [left,  top,    front],
          [left,  bottom, front],
          [right, bottom, front],
          [right, top,    front]
        ]);
      }
      if (top > cy) {
        faces.top = projection([
          [left,  top, front],
          [left,  top, back],
          [right, top, back],
          [right, top, front]
        ]);
      }
      if (left > cx) {
        faces.left = projection([
          [left, top,    front],
          [left, top,    back],
          [left, bottom, back],
          [left, bottom, front]
        ]);
      }
      if (right < cx) {
        faces.right = projection([
          [right, top,    front],
          [right, top,    back],
          [right, bottom, back],
          [right, bottom, front]
        ]);
      }

  
      /*
      
      if (front > cz) {
        faces.front = projection([
          [left,  top,    front],
          [left,  bottom, front],
          [right, bottom, front],
          [right, top,    front]
        ]);
      }
      if (top > cy) {
        faces.top = projection([
          [left,  top, front],
          [left,  top, back],
          [right, top, back],
          [right, top, front]
        ]);
      }
      if (left > cx) {
        faces.left = projection([
          [left, top,    front],
          [left, top,    back],
          [left, bottom, back],
          [left, bottom, front]
        ]);
      }
      if (right < cx) {
        faces.right = projection([
          [right, top,    front],
          [right, top,    back],
          [right, bottom, back],
          [right, bottom, front]
        ]);
      }

      */
  
      return faces;
    }
  
    accessor(bar3d, config, 'camera', true);
    accessor(bar3d, config, 'x');
    accessor(bar3d, config, 'y');
    accessor(bar3d, config, 'z');
    accessor(bar3d, config, 'width');
    accessor(bar3d, config, 'height');
    accessor(bar3d, config, 'depth');
  
    return bar3d;
  }