
  
        const Hesanlama = (function() {

       

        // navbarda sahdaki nid
        function haqqindaPenceresiniCalisdir(){
          $('#info_btn').on('click',(e)=>{
          // 327px-den genis cihazlar ucun
          if ($(window).width()>327) {

            dialog.alert({
              title:'Məlumat',
              message:  `

              Proyekt Hilal Hilallı tərəfindən hazırlanmışdır<br/> tərcübə xarakterli olaraq. <br/>Əlaqə üçün :
              <a href = "mailto:hilalhilalli348@gmail.com">Məktub yaz</a> <a href="tel:+994508563308">Zəng et</a> <br/>
              <a href="#show_info">Məlumatları göstər</a> <br/>
              <span id="show_info">Email : hilalhilalli348@gmail.com<br/>Tel : 050-856-33-08</span>

              `,

              button: "Bağla"
            });

            }else
            {

             dialog.alert({
             title:'Məlumat',
             message:  `

                   Proyekt hazırladı<br/>
                   Hilal Hilallı<br/>Əlaqə üçün<br/>
                   <a href = "mailto:hilalhilalli348@gmail.com">Məktub yaz</a> <br/>
                   <a href="tel:+994508563308">Zəng et</a> <br/>
                   <a href="#show_info">Məlumatları göstər</a> <br/>
                   <span id="show_info">Email : hilalhilalli348@gmail.com<br/>Tel : 050-856-33-08</span>
                   `,

             button: "Ok"
             });

             }

          })


        }

        // cedvel elementlerinin secilmesi.
        function connectListenerListItems(){
           let prevEl;

            // elementin siyahidan secilmesi/secilmemesi hadiseleri
            $('html').off('click').on('click',function(ev){

                // eger secilen td ve .form-control,#btn_sil
                // .dialog-border ve .dialog-message deyilse.
                if(
                  !$(ev.target).is('td') &&
                  !$(ev.target).is('.form-control') &&
                  !$(ev.target).is('#btn_sil') &&
                  !$(ev.target).is('#remove_icon') &&
                  !$(ev.target).is('#input_container_form') &&
                  // sil duymesinin reaksiyasi ile gelen alert penceresi eger secilmeyibse.
                  // .dialog-border ve .dialog-message alert penceresinin sinifleridir.
                  String($(ev.target).attr('class')).localeCompare('dialog-border')!=0 &&
                  String($(ev.target).attr('class')).localeCompare('dialog-message')!=0
                ){

                  $( '#input_mehsul_adi' ).val('');
                  $( '#input_mehsul_qiymeti' ).val('');

                      $('td').parent().removeClass('change_color');

                      $('#btn_kontrol').addClass('gizle');

                     if( !$('#btn_elave_et').hasClass('goster') ){

                          $('#btn_elave_et').removeClass('gizle');

                      }
                }
                else {


                    // eger element siyahida secilmeyibse
                    if( !$($('td').parent()).hasClass('change_color') )
                    {

                        $('#btn_kontrol').addClass('gizle');

                     }
                    // element siyahida secilibse
                    else {
                        $('#btn_elave_et').removeClass('goster');
                        $('#btn_kontrol').removeClass('goster');
                    }

                   }


            });

            // secilmis mehsula .change_color-un elave edilmesi
            $('.mehsullar').on('click',function (e) {



                let current_praduct_name = $($(e.target.parentNode).children()[1]).text();
                let current_praduct_price = parseFloat($($(e.target.parentNode).children()[2]).text());



                $( '#input_mehsul_adi' ).val(current_praduct_name);
                $( '#input_mehsul_qiymeti' ).val(current_praduct_price);

             if( prevEl!=undefined ) {
                prevEl.removeClass('change_color');

                prevEl = $(e.target).parent('tr');
                $(e.target).parent('tr').addClass('change_color');
             }
             else {
                 prevEl = $(e.target).parent('tr');
                 $(e.target).parent('tr').addClass('change_color');


             }


             $('#btn_elave_et').addClass('gizle');
             $('#btn_kontrol').removeClass('gizle');

             connectElementChange();

            });

        };

        //xeberdarliq penceresi girislerle bagli isdenmeyen inputlar olduqda.
        function xeberdarEt() {

            dialog.alert({
            message: "Məlumatları düzgün daxil edin",
            button: "Anladım"
            });

        }

        // cedvelde elemtin silinmesi / remove praduct
        function mehsuluSil(cavab){
          // hadise bas verecek.
          // secilen elementin data-id-si

          if(cavab){

            //cedvelde secilen element
           let selectedElement;

           let arr = Array.from($('.mehsullar'));

           //cedvelde secilen elementin data-id-sini selectedElement-ine menimsedilmesi.
           arr.forEach((ele)=>{

                //eger element secilibse o .change_color sinifine malikdir(connectListenerListItems() bunu edir)
                //buna gore elementi tapiriq.
                if($(ele).hasClass('change_color')){

                      selectedElement=$(ele).attr('data-id');

                 }

           })

           let jsonFile = JSON.parse(localStorage.getItem('mehsullar'));

           // elementin silinmesi localstorage-den
           if(jsonFile!=null   && jsonFile.length>0){

                 let mehsullarArr = JSON.parse(localStorage.getItem('mehsullar'));

                 mehsullarArr.forEach((el,index)=>{

                      if(el.id==selectedElement){

                            mehsullarArr.splice(index,1);

                            return;
                      }

                  })


                  localStorage.removeItem('mehsullar');
                  localStorage.setItem('mehsullar', JSON.stringify(mehsullarArr));
                  jsonFile= JSON.parse(localStorage.getItem('mehsullar'));
             }

             // eger json bos olarsa mehsul []-in sil ve qiymet tutucu containeri gizle
             if(jsonFile==0){

             localStorage.removeItem('mehsullar');
                    $('#qiymet_tutucu_container').removeClass('goster');
                    $('#qiymet_tutucu_container').addClass('gizle');

              }

              $('#btn_kontrol').addClass('gizle');
              $('#btn_elave_et').removeClass('gizle');


              cedveliYoxla();
            }

        };

        // cedvelde elementin deyisdirilmesi / update praduct
        function mehsuluDeyis(){

          let praduct_name = $('#input_mehsul_adi').val();
          let praduct_price = $('#input_mehsul_qiymeti').val();

          // eger ad ve qiymet uygun olaraq herifle baslayir ve qiymet yalniz ededdirse(daxilinde herif yoxdursa) kecerli olsun
          if (/^[a-zA-Z]/.test(praduct_name) &&  /^\d*(\.\d+)?$/.test(praduct_price)) {
             praduct_name = praduct_name.trim();
             praduct_price = parseFloat(praduct_price).toFixed(2);


          // cari tarixin alinmasi
          let indiki_tarix = new Date();
          let aze_indiki_tarix = dateFormat(indiki_tarix, "d.m.yyyy H:MM");

          // eger pradukt adi ve qiymeti duzgun daxil edilibse mehsul deyisdirilsin.


            let sele; // secilen elementin data-id-si
            let arrLs = Array.from($('.mehsullar'));
            arrLs.forEach((ele,index)=>{
                        if($(ele).hasClass('change_color')){
                          sele=$(ele).attr('data-id');
                        }
            });


            let jsonFileList = JSON.parse(localStorage.getItem('mehsullar'));

            jsonFileList.forEach((el)=>{
                 if(el.id == sele){
                      el.name = praduct_name;
                      el.price = praduct_price;
                      el.date = aze_indiki_tarix;
                      return;
                 }
             })

             localStorage.removeItem('mehsullar');
             localStorage.setItem('mehsullar',JSON.stringify(jsonFileList));

             cedveliYoxla();



        }else{ xeberdarEt(); }

        }

        // cedvelde secilen mehsulun legv edilmesi(qirmizi reng veren stil sinifinin silinmesi)
        function mehsulunSeciminLegvEt(){
          $('#btn_kontrol').removeClass('goster');
          $('#btn_elave_et').removeClass('gizle');
          $('tr').removeClass('change_color');
        }

        // elementlerin silinmesi/deyisdirilmesi ve imtina edilmesi prosesleri.
        function connectElementChange(){
            // .manipulation_button elementlerinin birinci click hadisesini baglayiriq
            //sonra ise yeniden click hadisesini aktif edirik
            // sebebi birden cox click hadisenin eyni anda bas vermemesi ucundur.
             $( '.manipulation_button' ).off().on('click',function(e){
               
                // duymelerin default hadiselerinin silinmesi
                e.preventDefault();


                if ($(e.target).is('#btn_sil,#remove_icon')) {
                  //silinib/silinmeyeceyi haqqinda isdek penceresi
                  dialog.confirm({
                    button: "Bəli",
                    required: true,
                    cancel: "İmtina",
                    message: "Əminsiniz ?",
                    callback: mehsuluSil
                  });
                }
        
                // deyis duymesi
             if($(e.target).is('#btn_deyis,#change_icon')){
                mehsuluDeyis();
              }
        
                // imtina duymesi
                if($(e.target).is('#btn_imtina,#cancel_icon')){
                  mehsulunSeciminLegvEt();
                }
               
               

             })
        }

        function dollarQarsiliqinHesabla( prices ){

            // dollar cinsinden qiymetin hesablanmasi restful api(muyyen limitedn sonra islemedi)
             // let usd_exchange_rate = fetch('https://v6.exchangerate-api.com/v6/2e1d482ae3c30b510eeaeb05/latest/USD').
             // then(res=>res.json()).
             // then(res=>res.conversion_rates.AZN).
             // then(usd_in_azn=>{
             //
             //   let price_in_usd =  (prices/parseFloat(usd_in_azn)).toFixed(2);
             //   $( '#text_umumi_qiymet_usd' ).text(price_in_usd);
             // });

             // api islemediyi ucun statik qiymetlere gore hesablama
             let price_in_usd =  (prices/1.7).toFixed(2);
             $( '#text_umumi_qiymet_usd' ).text(price_in_usd);


        }

        // btn_elave_et calisdirildiqi zaman.
        $( '#btn_elave_et' ).click(
        function(e){

            e.preventDefault();

            //element elave edildikden sonra inputlarin icinin temizlenmesi
            let praduct_name = $( '#input_mehsul_adi' ).val();
            let praduct_price = $( '#input_mehsul_qiymeti' ).val();



            // eger ad ve qiymet uygun olaraq herifle baslayir ve qiymet yalniz ededdirse(daxilinde herif yoxdursa) kecerli olsun
            if (/^[a-zA-Z]/.test(praduct_name) &&  /^\d*(\.\d+)?$/.test(praduct_price)) {
               praduct_name = praduct_name.trim();
               praduct_price = parseFloat(praduct_price).toFixed(2);

              //giris inputlari
              $( '#input_mehsul_adi' ).val('');
              $( '#input_mehsul_qiymeti' ).val('');


              // cari tarixin alinmasi
              let indiki_tarix = new Date();
              let aze_indiki_tarix = dateFormat(indiki_tarix, "d.m.yyyy H:MM");



              // localstorage-a elave edilme
              if ( localStorage.getItem('mehsullar')==null ){


                    let ob_arr = [
                      {
                        id:0,
                        name:praduct_name,
                        price:praduct_price,
                        date:aze_indiki_tarix
                      }
                    ]
                    localStorage.setItem('mehsullar',JSON.stringify(ob_arr));
                    cedveliYoxla();
              }
              else {

                    let mehsullar = JSON.parse(localStorage.getItem('mehsullar'));
                    let index = mehsullar[ mehsullar.length-1].id;
                    index++;
                    mehsullar.push(
                        {
                           id:index,
                           name : `${praduct_name}`,
                           price : `${praduct_price}`,
                           date : `${aze_indiki_tarix}`
                        }
                    );

                    localStorage.setItem('mehsullar',JSON.stringify(mehsullar));
                    cedveliYoxla();
               }


                // oxuyucu
                connectListenerListItems();

               // localstroage-den melumatlarin alinmasi
               let mehsullar = JSON.parse( localStorage.getItem('mehsullar') );

               /// qiymetin hesablamasi
               let prices=0;

                    if(prices==0){
                          mehsullar.forEach(el=>{
                          prices+=parseFloat(el.price);
                      })
                     }

                   //price-in yazilmasi
                   $( '#text_umumi_qiymet_azn' ).text(prices.toFixed(2));



               // dollar cinsinden qiymetin hesablanmasi
               dollarQarsiliqinHesabla(prices);


               //emeliyyatdan sonra bloklarin gizledilmesi/gosterilmesi
               $( '#meshul_yoxdur' ).removeClass('goster')
               $( '#qiymet_tutucu_container' ).removeClass('gizle');
               $( '#cedvel' ).removeClass('gizle');


          }else {  xeberdarEt(); }

            }



        );

        // cedvel mehsullarinin yoxlanmasi ona gore qiymetin hesablanmasi
        function cedveliYoxla(){

            //cedvel eger bos deyilse
            if( localStorage.getItem('mehsullar')!=null ){


                  // cedveldeki qiymetlerin hesablanmasi

                  let prices= 0;

                  $( '#mehsul_cedveli' ).html( '' );

                    let mehsullar = JSON.parse( localStorage.getItem('mehsullar') );

                    // let cedvelBody = $('#mehsul_cedveli');

                  mehsullar.forEach( ( ele )=>{

                            $('#mehsul_cedveli').append($(`
                            <tr class="mehsullar" data-id="${ele.id}">
                            <td>${ele.id}</td>
                            <td>${ele.name}</td>
                            <td>${ele.price}</td>
                            <td>${ele.date}</td>
                            </tr>
                            `));

                             prices += parseFloat(ele.price);


                 })

                 // oxuyucu
                 connectListenerListItems();

                 // qiymetin yazilmasi
                 $( '#text_umumi_qiymet_azn' ).text(prices.toFixed(2));
                 dollarQarsiliqinHesabla(prices);


                 $( '#meshul_yoxdur' ).removeClass('goster');
                 $( '#qiymet_tutucu_container' ).addClass('goster');

            } else {

                   $( '#cedvel' ).addClass('gizle');
                   $( '#meshul_yoxdur' ).addClass('goster');
                   $( '#qiymet_tutucu_container' ).addClass('gizle');

            }
        };

        cedveliYoxla();
        haqqindaPenceresiniCalisdir();


        
        

    })();
