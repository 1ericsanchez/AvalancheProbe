$fn=80;

// post properties
post_width = 2.9;
post_thickness = 1.7;
post_height = 12;
post_offset = 4;

// basket properties
basket_w = 1.5;
basket_h = 5;
basket_i = 20;
basket_o = 25;

// basket punchout properties
punchout_n = 5;
punchout_r = 7;
punchout_offset = 22;

//minkowski() {
 //  sphere([0.5,0.5,1]);
   final();
//}

module final () {
    difference() {
        union() {
            union() {
                difference() {
                    basket(basket_i, basket_o, basket_w, basket_h);
                    post(0, post_width*2, 8, post_offset);
                }
            }
            post(post_width, post_thickness, post_height, post_offset);
        }
        punchouts(punchout_n, punchout_r, punchout_offset);
    }
}

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

module punchouts (n, r, offset) {
    for (i = [0: n-1]) {
    rotate ([0, 0, i * 360/n]) translate ([offset, 0, -5]) 
        cylinder (r = r, h = 8);
    }
}
