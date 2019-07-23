import { Router } from 'express';
import { MensaController } from '@home/controller';

const router = Router();

router.get('/', MensaController.getMensas);
router.get('/:id', MensaController.getMealsForMensa);

export const MensaRouter = router;
