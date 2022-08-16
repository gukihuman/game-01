<script>
export default {
  inject: ["provider"],
  props: ["x1", "x2", "radius"],
  render() {
    if (!this.provider.context) return;

    const c = this.provider.context;

    c.beginPath();
    c.arc(this.x1, this.x2, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = "#6a040f";
    c.fill();
  },
};
</script>
