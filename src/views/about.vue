<template>
    <div class="about">
        <canvas id="canvas" width="300" height="300" style="width"></canvas>
    </div>
</template>

<script>
    import SmoothSignature from "smooth-signature";
    
    export default {
        data() {
            return {
                txt: '',
                timer: ''
            }
        },
        mounted() {
            const canvas = document.querySelector("#canvas");
            const signature = new SmoothSignature(canvas, {
                width: 400,
                height: 400,
                scale: 1,
                minWidth: 4,
                maxWidth: 10,
            })
        },
        methods: {
            handleKeyUp() {
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    console.log(this.txt)
                }, 250);
            }
        }
    }
</script>
