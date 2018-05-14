var mexSentRowOpen = "<div class='message-row msg-sent'>",
    mexReceivedRowOpen = "<div class='message-row msg-received'>",
    mexBoxOpen = "<div class='message-box'>",
    timeBoxOpen = "<span class='msg-time'>",
    timeBoxClose = "</span>",
    mexBoxClose = "</div>",
    mexRowClose = "</div>";

//Struttura HTML contenente l'icona del dropdown menu interna al box messaggio
var msgIconOpen = "<span class='msg-icon'>",
    faIconOpen = "<i class='fa fa-angle-down fa-lg' aria-hidden='true'>",
    faIconClose = "</i>",
    msgIconClose = "</span>",
    msgIcon = msgIconOpen + faIconOpen + faIconClose + msgIconClose;


//Struttura HTML dropdown menu interno ad ogni messaggio
var dropMenuOpen = "<div class='msg-dropdown'>",
    dropMenuDelete = "<div id='delete'>Elimina</div>",
    dropMenuClose = "</div>",
    dropMenu = dropMenuOpen + dropMenuDelete + dropMenuClose;

//Struttura HTML del "triangolo" presente solo nel primo messaggio nella inserisce
//di messaggi inviati/ricevuti precedente alla serie successiva
var rightTrinagleOpen = "<span class='first-new-sent-msg'>",
    rightTrinagleClose = "</span>",
    rightTrinagle = rightTrinagleOpen + rightTrinagleClose;
var leftTrinagleOpen = "<span class='first-new-received-msg'>",
    leftTrinagleClose = "</span>",
    leftTrinagle = leftTrinagleOpen + leftTrinagleClose;

$(document).ready(function(){
   // alert("ciao");

   //Recupera il campo di input
   var $thisInput = $('#input-msg');
   var newMessage;
   var now = new Date();

   var minutes;
   if (now.getMinutes() < 10) {
      minutes = parseInt('0' + now.getMinutes());
   } else {
      minutes = now.getMinutes();
   }

   //Invio del messaggio tramite pressione del tasto Enter
   $('#input-msg').keypress(function(e) {
      //13 = Tasto invio
      if (e.which == 13) {
         newMessage = $thisInput.val();
         if(newMessage) {
            sendMessage(newMessage);
            resetInput($thisInput);
            defaultAnswer();
         }
      }
   });

   //Invio del messaggio tramite click dell'icona di invio
   $('.send-icon').click(function() {

      var $thisInput = $('#input-msg');
      newMessage = $thisInput.val();
      if(newMessage) {
         sendMessage(newMessage);
         resetInput($thisInput);
         //Viene inserito, dopo un secondo, un messaggio di risposta automatico "ok".
         defaultAnswer();
      }

   });

   //recupero l'input tramite il suo id
   var searchContacts = $('#contacts-search');

   //Ricerca filtrata contatti
   $('#contacts-search').keyup(function(e) {

      //recupero il contenuto dell'input
      var instantInput = $(this).val().toLowerCase();

      //recupero tutti gli elementi con classe 'chat-with'; essi contengono i nomi
      //dei contatti. Su ognuno di essi viene effettuato il controllo per verificare
      //se i caratteri immessi nell'input sono contenuti nel nome del contatto.
      //Ogni contatto in base al risultato del controllo verrà mostrato o nascosto
      $('.chat-with').each(function(){

         //Recupero il genitore del contatto, lo utilizzo per mostrare o noscondere il contatto
         var thisContact = $(this).parent().parent().parent();

         //Salvo in una variabile il nome del contatto corrente
         var contactName = $(this).text().toLowerCase();

         //Verifico che il contatto corrente contenga i caratteri digitati dall'utente
         var isMatched = isCharachterMatched(contactName, instantInput);

         if (!isMatched) {
            thisContact.hide();
         } else {
            thisContact.show();
         }

      });

   });

   //Metodo che permette di tenere la scrollbar fissa in basso per visualizzare sempre l'ultimo
   //messaggio inviato/ricevuto
   $('.conversation-area.visible').scrollTop($('.conversation-area.visible')[0].scrollHeight);

   //Mostro la conversazione relativa al contatto cliccato
   $('.conversation-preview').click(function(){
      //recupero la conversazione attualmente mostrata; la nascondo aggiungento la classe hidden
      var conversationDisplayed = $('.conversation-area.visible');
      conversationDisplayed.removeClass('visible').addClass('hidden');
      console.log(conversationDisplayed);
      //recupero il contatto cliccato salvando in una variabile il suo id. Questo verrà utilizzato
      //per prendere la relativa conversazione e mostrarla
      var contactClicked = $(this);
      var contactId = contactClicked.attr('id');
      var currentConversation = $('.'+contactId+'.conversation-area');
      currentConversation.removeClass('hidden').addClass('visible');
      updateConversationInfo(contactClicked);
      $('.conversation-area.visible').scrollTop($('.conversation-area.visible')[0].scrollHeight);
      // currentConversation.scrollTop(currentConversation.scrollHeight);
   });

   //Con i metodi mouseenter sul singolo messaggio, aggiungo l'icona del menu e la mostro,
   //con mouseleave uscendo dall'area del messaggio la nascondo e rimuovo
   $(document).on('mouseenter', '.message-box', function(){
   //Aggiungo l'icona del menu all'elemento corrente
      $(this).append(msgIcon);
      //al click dell'icona aggiungo il dropdown menu e lo visualizzo
      $('.msg-icon').click(function(){
         var msgClicked = $(this).parent();
         msgClicked.append(dropMenu);
         //Al click della voce "Elimina" del dropdown menu recupero il messaggio
         //in oggetto e lo elimino
         $('#delete').click(function(){
            console.log($(this).parent().parent().remove());
         });
      });
   });

   $(document).on('mouseleave', '.message-box', function(){
         var element = $(this);
         element.children().remove('.msg-icon');
         element.children().remove('.msg-dropdown');
   });

   //appendTriangle();

   /* * * * * * Functions * * * * * */

   //Funzione che riceve il nome del contatto corrente (nameToSearch) e l'input immesso
   //dall'utente
   function isCharachterMatched(nameToSearch, instantInput) {
      var isCharsConteined = false;
      var noMatchCounter = 0;

      /*
         Questo controllo è indipendente dalla sequenza con la quale vengono inseriti
         i caratteri in input. Controlla che i caratteri siano contenuti nel nome senza
         tener conto dell'ordine.
         Il charAt all'interno del for permette di considerare e controllare ogni carattere
         singolarmente


      // for (var i = 0; i < instantInput.length; i++) {
      //    if ( !(nameToSearch.includes(instantInput.charAt(i))) ) {
      //       noMatchCounter++;
      //    }
      // }

      //Il contatore maggiore di 0 indica che il nome non contiene tutti i caratteri,
      //perciò la variabile verrà impostata a false, altrimenti a true
      // if (noMatchCounter > 0) {
      //    isCharsConteined = false;
      // } else {
      //    isCharsConteined = true;
      // }

      */

      //Controllo che il nome contenga i caratteri immessi dall'input. Se non li contiene
      //il contatore aumenta
      if ( !(nameToSearch.includes(instantInput)) ) {
         noMatchCounter++;
         isCharsConteined = false;
      } else {
         isCharsConteined = true;
      }

      return isCharsConteined;
   }

   //Funzione per l'invio di un messaggio
   function sendMessage(textMessage) {
      //Generea un nuovo messaggio, e lo inserisce alla fine della conversation-area
      if (textMessage) {

         $('.conversation-area.visible').append(
            mexSentRowOpen + mexBoxOpen + textMessage + timeBoxOpen + now.getHours() + " : " + minutes + timeBoxClose +  mexBoxClose + mexRowClose
         );
         $('.conversation-area.visible').scrollTop($('.conversation-area.visible')[0].scrollHeight);
         appendTriangle();
      }
   }

   //Funzione che resetta il campo input dopo l'invio del messaggio
   function resetInput(inputField) {
      inputField.val('');
   }

   //Funzione che invia una risposta standard ok un secondo dopo l'invio di un messaggio
   function defaultAnswer() {
      setTimeout(function(){
         $('.conversation-area.visible').append(
            mexReceivedRowOpen + mexBoxOpen + "ok" + timeBoxOpen + now.getHours() + " : " + minutes + timeBoxClose + mexBoxClose + mexRowClose
         );
         $('.conversation-area.visible').scrollTop($('.conversation-area.visible')[0].scrollHeight);
         appendTriangle();
      },1000);
   }

   //Funzione che riceve come parametro un oggetto JQuery che rappresenta il contatto cliccato
   //Recupera la foto e il nome del contatto e aggiorna la nav bar del box conversazione
   //inserendo foto e nome del contatto cliccato
   function updateConversationInfo(contactClicked) {

      var contactPhoto = contactClicked.children('.photo-box').children('.profile-photo').attr('src');
      var contactName = contactClicked.children('.preview').children('.msg-preview').children('.chat-with').text();

      //Recuepero il box contenente foto e nome della navBar
      var conversationNav = $('.conversation-ctn').children('.section-nav').children('.contact-info');
      conversationNav.children('.profile-photo').attr('src', contactPhoto);
      conversationNav.children('.chat-with').text(contactName);
   }

   //Inserisce i triangolini all'angolo sinistro o destro del messaggio
   function appendTriangle() {
      $('.message-row').each(function(){
         var mexCurrent = $(this);
         prevMex = mexCurrent.prev('.message-row');

         if (mexCurrent.hasClass('msg-received')) {
            if ( !(prevMex.hasClass('msg-received')) && ( !(mexCurrent.children().hasClass('.first-new-received-msg')) ) ) {
               mexCurrent.append(leftTrinagle);
            }
         }  else if (mexCurrent.hasClass('msg-sent')) {
            if( !(prevMex.hasClass('msg-sent')) ) {
               mexCurrent.append(rightTrinagle);
            }
         }
      });
   }

});
