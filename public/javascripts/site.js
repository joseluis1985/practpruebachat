$(function($) {
// vemos el evento de teclado sobre el campo de texto nickname y verificamos si el usuario a presionado ENTER
//y que no este vacio
		var socket=io();
		$("#nickname").keydown(function(event){
				if(event.keyCode==13 && $(this).val()!="")
				{
						console.log(nickname);
						socket.emit("setnickname",{"nick":$(this).val()});
				}
		});
		
		socket.on("setnickname",function(response){
				if(response.server===true)
				{
					//en caso de que el nick este disponible accedemos
					//al sistema de chat para ello llamaremos al metodo
					//loadhtml que definiremos mas abajo
						loadhtml("/saladechat/");
						$("#nickname").attr('disabled','true');
				}else{
						alert(response.server)
				}
		})
		var loadhtml=function(url)
		{
				$.ajax({
						url: url,
						type: 'GET',
						dataType: 'html',
						data: {},
				})
				.done(function(html){
						$("#content").html(html);
						enabledchat();
						getLista();
				})
				.fail(function(){
				})
				.always(function(){
				});
		}
		var mostrarLista=function(Listausuarios)
		{
				html="";
				for(var i=0;i<Listausuarios.length;i++)
				{
						html+="<li>"+Listausuarios[i].nick+"</li>"
				}
				$("#usuarios").html(html);
		}
		var getLista=function()
		{
				socket.emit("get_lista",{});
		}
		var enabledchat=function()
		{
				$("#menvio").keydown(function(event){
						if(event.keyCode==13)
						{
								socket.emit("mensajes",{"nick":$("#nickname").val(),"msn":$(this).val()})
								$(this).val("");
						}
				});
		}
		socket.on("get_lista",function(response){
				mostrarLista(response.lista);
		});
		socket.on("mensajes",function(response){
				console.log(response);
				$("#mensajes").append("<li>"+response.nick+">"+response.msn+"</li>")
		});
});
