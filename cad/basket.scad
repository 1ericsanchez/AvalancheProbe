$fn=50;

pole_width = 2.9;
pole_thickness = 1.7;
post_height = 12;
b_w = 2;
b_h = 5;
b_i = 20;
b_o = 25;
post_offset = 4;

difference() {
    basket(b_i, b_o, b_w, b_h);
    post(0, pole_width*2, 8, post_offset);
}
post(pole_width, pole_thickness, post_height, post_offset);

module basket (r1, r2, w, h) {
        difference () {
        cylinder(h = h, r1 = r1, r2 = r2, center=true);
        translate([0, 0, w]) 
            cylinder(h = h, r1 = r1, r2 = r2, center=true);
    }
} 

module post (r, w, h, offset) {
    translate([0,0,-offset]) difference (){
        cylinder(h = h, r1 = r+(w/2), r2 = r+(w/2));
        translate([0,0,-0.1])
        scale([1,1,1.2]) 
        cylinder(h = h, r1 = r, r2 = r);
    }
}


