<template>
    <div class="content">
        <div class="circle"></div>
        <div class="df df--space-between">
            <div class="logo">
                Spotiswipe
            </div>
            <div class="setting-btn"></div>
        </div>
        <div class="cards">
            <div class="cards__item active"></div>
            <div class="cards__item"></div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Home',
    components: {},
    mounted() {
        let animating = false;
        let cardsCounter = 0;
        const numOfCards = 6;
        const decisionVal = 80;
        let pullDeltaX = 0;
        let deg = 0;
        let $card;
        let $cardReject;
        let $cardLike;

        function pullChange() {
            deg = pullDeltaX / 10;
            animating = true;
            $card.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

            const opacity = pullDeltaX / 100;
            const rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
            const likeOpacity = (opacity <= 0) ? 0 : opacity;
            $cardReject.style.opacity = rejectOpacity;
            $cardLike.style.opacity = likeOpacity;
        }

        function release() {
            if (pullDeltaX >= decisionVal) {
                $card.classList.add('to-right');
            } else if (pullDeltaX <= -decisionVal) {
                $card.classList.add('to-left');
            }

            if (Math.abs(pullDeltaX) >= decisionVal) {
                $card.classList.add('inactive');

                setTimeout(() => {
                    $card.classList.add('below').remove('inactive to-left to-right');
                    cardsCounter += 1;
                    if (cardsCounter === numOfCards) {
                        cardsCounter = 0;
                        document.querySelector('.demo__card').classList.remove('below');
                    }
                }, 300);
            }

            if (Math.abs(pullDeltaX) < decisionVal) {
                $card.classList.add('reset');
            }

            setTimeout(() => {
                $card.setAttribute('style', '').classList.remove('reset').querySelector('.demo__card__choice').setAttribute('style', '');

                pullDeltaX = 0;
                animating = false;
            }, 300);
        }
        release();
        pullChange();

        ['touchstart', 'mousedown'].forEach((evt) => document.documentElement.addEventListener(evt, (event) => {
            if (event.target.closest('.demo__card:not(.inactive)')) {
                if (animating) return;

                $card = event.target;
                $cardReject = $card.querySelector('.demo__card__choice.m--reject');
                $cardLike = $card.querySelector('.demo__card__choice.m--like');
                const startX = event.pageX || event.originalEvent.touches[0].pageX;
            }
        }, false));
        // $(document).on("mousedown touchstart", ".demo__card:not(.inactive)", function(e) {
        //     if (animating) return;
        //
        //     $card = $(this);
        //     $cardReject = $(".demo__card__choice.m--reject", $card);
        //     $cardLike = $(".demo__card__choice.m--like", $card);
        //     var startX = e.pageX || e.originalEvent.touches[0].pageX;
        //
        //     $(document).on("mousemove touchmove", function(e) {
        //         var x = e.pageX || e.originalEvent.touches[0].pageX;
        //         pullDeltaX = (x - startX);
        //         if (!pullDeltaX) return;
        //         pullChange();
        //     });
        //
        //     $(document).on("mouseup touchend", function() {
        //         $(document).off("mousemove touchmove mouseup touchend");
        //         if (!pullDeltaX) return; // prevents from rapid click events
        //         release();
        //     });
        // });
    },
};
</script>
