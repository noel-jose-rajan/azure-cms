import { z } from "zod";

export const routingSchema = z.object({
  id: z.number(),
  is_cc: z.boolean(),
  urgency_level: z.number().optional(),
  to_entity_id: z.number().optional(),
  to_user_id: z.number().optional(),
  required_action: z.number(),
  comments: z.string(),
});

export const routeFormSchema = z.object({
  notify_me: z.boolean().optional(),
  result_as_task: z.boolean().optional(),
  comments: z.string().optional(),
  urgency_level: z.number(),
  required_action: z.number(),
  ccUsers: z.array(routingSchema).optional(),
  route_list: z.array(routingSchema).optional(), // Adjust type as needed
  date: z.string().optional(),
});
export type RoutingType = z.infer<typeof routingSchema>;

export type RouteFormType = z.infer<typeof routeFormSchema>;
