var scene = null;
var camera = null;
var renderer = null;
var camControls = null;

var storeLength = 1500;
var cabinetCount = 12;

function updateStore()
{
	setCookie('selectedstore', this.store);
	window.location.reload(); 
//	removeEntities();
//	initScene();
//    camera.position.x = 0;
 //   camera.position.y = 170;
//    camera.position.z = -100;
//    camControls.lon = -90;
//    camControls.lat = 120;
}

function queryCabinet()
{
	
}

function getCookie(c_name){
　　　　if (document.cookie.length>0){　　//先查询cookie是否为空，为空就return ""
　　　　　　c_start=document.cookie.indexOf(c_name + "=")　　//通过String对象的indexOf()来检查这个cookie是否存在，不存在就为 -1　　
　　　　　　if (c_start!=-1){ 
　　　　　　　　c_start=c_start + c_name.length+1　　//最后这个+1其实就是表示"="号啦，这样就获取到了cookie值的开始位置
　　　　　　　　c_end=document.cookie.indexOf(";",c_start)　　//其实我刚看见indexOf()第二个参数的时候猛然有点晕，后来想起来表示指定的开始索引的位置...这句是为了得到值的结束位置。因为需要考虑是否是最后一项，所以通过";"号是否存在来判断
　　　　　　　　if (c_end==-1) c_end=document.cookie.length　　
　　　　　　　　return unescape(document.cookie.substring(c_start,c_end))　　//通过substring()得到了值。想了解unescape()得先知道escape()是做什么的，都是很重要的基础，想了解的可以搜索下，在文章结尾处也会进行讲解cookie编码细节
　　　　　　} 
　　　　}
　　　　return ""
　　}　　

function setCookie(c_name, value){
 　　　　document.cookie=c_name+ "=" + escape(value);
 　　}

function init()
{
	var selectedstore = getCookie('selectedstore');
	if (selectedstore == '')
	{
		var rrr = Math.floor(Math.random() * 4);
		selectedstore = '仓库' + rrr;
	}
	
	
	if (selectedstore == '仓库1')
	{
		storeLength = 1500;
		cabinetCount = 12;
	}
	if (selectedstore == '仓库2')
	{
		storeLength = 3000;
		cabinetCount = 24;
	}
	if (selectedstore == '仓库3')
	{
		storeLength = 4500;
		cabinetCount = 36;
	}
	if (selectedstore == '仓库4')
	{
		storeLength = 6000;
		cabinetCount = 48;
	}

    var controls = new function () {
        this.store = selectedstore;
		this.queryStore = '';
    };
	
    var gui = new dat.GUI();
    gui.add(controls, "store", ['仓库1', '仓库2', '仓库3', '仓库4']).onChange(updateStore);
	gui.add(controls, "queryStore", '').onChange(queryCabinet);

    var clock = new THREE.Clock();


    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('scene') });
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
	initScene();
	
	
	
	
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.x = 0;
    camera.position.y = 170;
    camera.position.z = -100;

    camControls = new THREE.FirstPersonControls(camera);
    camControls.lookSpeed = 0.05;
    camControls.movementSpeed = 80;
    camControls.noFly = true;
    camControls.lookVertical = false;
    camControls.constrainVertical = true;
    camControls.verticalMin = 1.59;
    camControls.verticalMax = 1.6;
    camControls.lon = -90;
    camControls.lat = 120;

    var render = function () {
        camControls.update(clock.getDelta());
        requestAnimationFrame(render);
        renderScene();
    };
    render();
}

function initScene()
{
	var repository = createRepository(storeLength);
	repository.position.set(0, 250, -storeLength / 2);
	scene.add(repository);
	
	for(var i = 0; i < cabinetCount / 4; i++)
	{
		var c1 = createCabinet();
		c1.position.set(-300, 100, -400 - i * 400);
		scene.add(c1);
		
		var c2 = createCabinet();
		c2.position.set( 300, 100, -400 - i * 400);
		scene.add(c2);
		
		var r1 = createReverseCabinet();
		r1.position.set(-300, 100, -480 - i * 400);
		scene.add(r1);

		var r2 = createReverseCabinet();
		r2.position.set(300, 100, -480 - i * 400);
		scene.add(r2);
	}
}

function renderScene()
{
	renderer.clear();
    renderer.render(scene, camera);
}

function createRepository(depth)
{
    var repository = new THREE.Object3D();

    var back = createMesh(new THREE.BoxGeometry(1000, 500, 2));
    var front = createMesh(new THREE.BoxGeometry(1000, 500, 2));
    var left = createMesh(new THREE.BoxGeometry(2, 500, depth));
    var right = createMesh(new THREE.BoxGeometry(2, 500, depth));
    var top = createMesh(new THREE.BoxGeometry(1000, 2, depth));
    var bottom = createMesh(new THREE.BoxGeometry(400, 4, depth));
    bottom.receiveShadow = true;

    back.position.set(0, 0, -depth / 2);
    front.position.set(0, 0, depth / 2);
    left.position.set(-500, 0, 0);
    right.position.set(500, 0, 0);
    top.position.set(0, 250, 0);
    bottom.position.set(0, -250, 0);

    repository.add(back);
    repository.add(front);
    repository.add(left);
    repository.add(right);
    repository.add(top);
    repository.add(bottom);
    return repository;
}

function createCabinet()
{
    var x = 400;
    var y = 200;
    var z = 80;
    var cabinet = new THREE.Object3D();

    var back = createMesh(new THREE.BoxGeometry(x, y, 2));
    var left = createMesh(new THREE.BoxGeometry(4, y, z));
    var right = createMesh(new THREE.BoxGeometry(4, y, z));
    var top = createMesh(new THREE.BoxGeometry(x, 2, z - 20));
    var bottom = createMesh(new THREE.BoxGeometry(x, 4, z - 20));

    var h1 = createMesh(new THREE.BoxGeometry(x, 2, z - 20));
    var h2 = createMesh(new THREE.BoxGeometry(x, 2, z - 20));
    var h3 = createMesh(new THREE.BoxGeometry(x, 2, z - 20));

    var c1 = createMesh(new THREE.BoxGeometry(2, y - 20, z - 20));
    var c2 = createMesh(new THREE.BoxGeometry(2, y - 20, z - 20));
    var c3 = createMesh(new THREE.BoxGeometry(2, y - 20, z - 20));

    back.position.set(0, 0, -z / 2);
    left.position.set(-x / 2, 0, 0);
    right.position.set(x / 2, 0, 0);
    top.position.set(0, y / 2 - 20, -10);
    bottom.position.set(0, -y / 2, -10);

    h1.position.set(0, 35, -10);
    h2.position.set(0, -10, -10);
    h3.position.set(0, -55, -10);

    c1.position.set(-x / 4, -10, -10);
    c2.position.set(0, -10, -10);
    c3.position.set(x / 4, -10, -10);
	

    cabinet.add(back);
    cabinet.add(left);
    cabinet.add(right);
    cabinet.add(top);
    cabinet.add(bottom);
    cabinet.add(h1);
    cabinet.add(h2);
    cabinet.add(h3);
    cabinet.add(c1);
    cabinet.add(c2);
    cabinet.add(c3);

    return cabinet;
}

function createReverseCabinet()
{
    var x = 400;
    var y = 200;
    var z = 80;
    var cabinet = new THREE.Object3D();

    var back = createMesh(new THREE.BoxGeometry(x, y, 2));
    var left = createMesh(new THREE.BoxGeometry(4, y, z));
    var right = createMesh(new THREE.BoxGeometry(4, y, z));
    var top = createMesh(new THREE.BoxGeometry(x, 2, z - 20));
    var bottom = createMesh(new THREE.BoxGeometry(x, 4, z - 20));

    var h1 = createMesh(new THREE.BoxGeometry(x, 2, z - 20));
    var h2 = createMesh(new THREE.BoxGeometry(x, 2, z - 20));
    var h3 = createMesh(new THREE.BoxGeometry(x, 2, z - 20));

    var c1 = createMesh(new THREE.BoxGeometry(2, y - 20, z - 20));
    var c2 = createMesh(new THREE.BoxGeometry(2, y - 20, z - 20));
    var c3 = createMesh(new THREE.BoxGeometry(2, y - 20, z - 20));

    back.position.set(0, 0, z / 2);
    left.position.set(-x / 2, 0, 0);
    right.position.set(x / 2, 0, 0);
    top.position.set(0, y / 2 - 20, 10);
    bottom.position.set(0, -y / 2, 10);

    h1.position.set(0, 35, 10);
    h2.position.set(0, -10, 10);
    h3.position.set(0, -55, 10);

    c1.position.set(-x / 4, 10, 10);
    c2.position.set(0, 10, 10);
    c3.position.set(x / 4, 10, 10);

    cabinet.add(back);
    cabinet.add(left);
    cabinet.add(right);
    cabinet.add(top);
    cabinet.add(bottom);
    cabinet.add(h1);
    cabinet.add(h2);
    cabinet.add(h3);
    cabinet.add(c1);
    cabinet.add(c2);
    cabinet.add(c3);

    return cabinet;
}

function createMesh(geometry)
{
    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [meshMaterial, wireFrameMat]);
    return mesh;
}
