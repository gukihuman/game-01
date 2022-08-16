<script>
export default {
  inject: ["provider"],
  props: ["pointX", "pointY", "radius"],
  data() {
    return {};
  },
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;

    c.beginPath();
    c.arc(this.pointX, this.pointY, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = "#6a040f";
    c.fill();
  },
};
</script>
