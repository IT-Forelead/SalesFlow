import { defineComponent, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import OrderService from '@/services/order.service';

export default defineComponent({
  name: 'CustomerOrder',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const orderId = route.params.orderId as string;

    onMounted(() => {
      OrderService.getMarketLocationByOrderId(orderId)
        .then((res) => {
          if (!res.data) {
            router.push({ name: 'Not-Found' }).then(() => {});
            return;
          }

          window.location.href = `https://maps.google.com/?q=${res.data.latitude},${res.data.longitude}`;
        })
        .catch(() => router.push({ name: 'Not-Found' }).then(() => {}));
    });

    return () => <></>;
  },
});
