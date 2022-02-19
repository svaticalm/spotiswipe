<template>
    <div class="cards">
        <template v-if="isCardsExist">
            <spotify-card
                v-for="(card, index) in tracks"
                :key="card.track.id"
                :class="{'active': (index === 0)}"
                :style="{'z-index': tracks.length - index}"
                :swipedCards="swipedCards"
                :index="index"
                :card="card">
            </spotify-card>
        </template>

        <template v-else>
            <div class="nothing">
                <div class="sad-icon"></div>
                Кажется, карточки закончились...<br>
                Приходите позже
            </div>
        </template>
    </div>
</template>

<script>
import SpotifyCard from '@/components/SpotifyCard.vue';

export default {
    name: 'SpotifyCards',
    components: {
        SpotifyCard,
    },
    props: {
        tracks: {},
    },
    data() {
        return {
            swipedCards: 0,
        };
    },
    computed: {
        isCardsExist() {
            return this.swipedCards !== this.tracks.length;
        },
    },
    methods: {
    },
    watch: {

    },
    mounted() {
        let animating = false;
        let cardsCounter = 0;
        const numOfCards = this.tracks.length;
        const decisionVal = 80;
        let pullDeltaX = 0;
        let deg = 0;
        let $card;
        let $cardReject;
        let $cardLike;

        const pullChange = () => {
            deg = pullDeltaX / 10;
            animating = true;
            $card.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;

            const opacity = pullDeltaX / 100;
            const rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
            const likeOpacity = (opacity <= 0) ? 0 : opacity;
            $cardReject.style.opacity = rejectOpacity;
            $cardLike.style.opacity = likeOpacity;
        };

        const release = () => {
            if (pullDeltaX >= decisionVal) {
                $card.classList.add('to-right');
            } else if (pullDeltaX <= -decisionVal) {
                $card.classList.add('to-left');
            }

            if (Math.abs(pullDeltaX) >= decisionVal) {
                $card.classList.add('inactive');

                setTimeout(() => {
                    $card.classList.add('below');
                    $card.classList.remove('inactive', 'to-left', 'to-right', 'active');
                    cardsCounter += 1;
                    this.swipedCards = cardsCounter;
                    if (cardsCounter === numOfCards) {
                        cardsCounter = 0;
                    } else {
                        document.querySelector('.cards__item:not(.below)').classList.add('active');
                    }
                }, 300);
            }

            if (Math.abs(pullDeltaX) < decisionVal) {
                $card.classList.add('reset');
            }

            setTimeout(() => {
                const zIndex = $card.style['z-index'];
                $card.setAttribute('style', `z-index: ${zIndex}`);
                $card.classList.remove('reset');
                $card.querySelector('.cards__item-choice.--reject').setAttribute('style', '');
                $card.querySelector('.cards__item-choice.--like').setAttribute('style', '');

                pullDeltaX = 0;
                animating = false;
            }, 300);
        };

        ['touchstart', 'mousedown'].forEach((evt) => document.documentElement.addEventListener(evt, (event) => {
            if (event.target.closest('.cards__item:not(.inactive)')) {
                if (animating) return;

                $card = event.target.closest('.cards__item:not(.inactive)');
                $cardReject = $card.querySelector('.--reject');
                $cardLike = $card.querySelector('.--like');

                const startX = event.pageX || event.touches[0].pageX;

                const onMove = (event1) => {
                    const x = event1.pageX || event1.touches[0].pageX;
                    pullDeltaX = (x - startX);
                    if (!pullDeltaX) return;
                    pullChange();
                };

                const onEnd = () => {
                    document.documentElement.removeEventListener('mousemove', onMove, true);
                    document.documentElement.removeEventListener('touchmove', onMove, true);
                    document.documentElement.removeEventListener('mouseup', onEnd, true);
                    document.documentElement.removeEventListener('touchend', onEnd, true);
                    if (!pullDeltaX) return; // prevents from rapid click events
                    release();
                };

                ['mousemove', 'touchmove'].forEach((evt1) => document.documentElement.addEventListener(evt1, onMove, true));

                ['mouseup', 'touchend'].forEach((evt2) => document.documentElement.addEventListener(evt2, onEnd, true));
            }
        }, true));
    },
};
</script>
