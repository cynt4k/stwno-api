import { Router } from 'express';
import { MensaController } from '@home/controller';

const router = Router();

router.get('/', MensaController.getMensas);
router.get('/:id', MensaController.getMealsForMensa);
router.get('/:id/:day', MensaController.getMealsForMensaAndDay);

export const MensaRouter = router;
