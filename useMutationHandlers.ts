// useMutationHandlers.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from './NotificationContext';
import { useUser } from './UserContext';

const useMutationHandlers = (mutationFn: any, queryKey: string, successMessage: string) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { showNotification } = useNotification();
  const { user } = useUser();

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
      showNotification(successMessage);
      navigation.goBack();
    },
  });

  const handleSubmit = (data: any) => {
    if (user) {
      mutation.mutate({ user_id: user.id, ...data });
    }
  };

  return handleSubmit;
};

export default useMutationHandlers;
